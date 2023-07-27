import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  of,
  Subscription,
  take,
} from 'rxjs';
import { ProductsConsumedDoc } from 'src/app/model/productsConsumed';
import { v4 as uuidv4 } from 'uuid';
import { DbService } from '../db/db.service';
import { DBRepository } from 'src/app/db/DB.repository';

@Injectable({
  providedIn: 'root',
})
export class ProductsConsumedService {
  prodConsumedSubject: BehaviorSubject<Array<ProductsConsumedDoc>> =
    new BehaviorSubject(new Array<ProductsConsumedDoc>());
  subscriptions: Array<Subscription> = [];
  tableIdSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private dbService: DBRepository<any>) {
    let s = this.tableIdSubject.subscribe((tableId) => {
      this.fetchProductsConsumed(tableId);
      this.initChangeHandler(tableId);
    });
  }

  initChangeHandler(tableId: string) {
    let sub: Subscription = this.dbService
      .getDocumentChanges$()
      .subscribe((changeDoc: ProductsConsumedDoc) => {
        if (changeDoc) {
          console.warn('handleChange called');
          this.dbService.handleDocumentChange(
            this.prodConsumedSubject,
            changeDoc,
            () => {
              this.fetchProductsConsumed(tableId);
            }
          );
        }
      });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  setTableId(tableId: string) {
    if (tableId === undefined || tableId === null || tableId == '') return;
    this.tableIdSubject.next(tableId);
  }

  fetchProductsConsumed(tableId: string) {
    if (tableId === undefined || tableId == '') return;

    console.error('fetchProductsConsumed called');
    let query = {
      selector: {
        type: 'products-consumed',
        table: `${tableId}`,
      },
      fields: ['_id', '_rev', 'table', 'type', 'products'],
      execution_stats: true,
      limit: 1,
    };
    // let q: Observable<any> = from(this.dbService.db.find(query)).pipe(
    //   map((obj: any) => obj['docs'])
    // );

    let q = this.dbService.fetchByTypeAndTableID(
      'products-consumed',
      tableId.toString(),
      ['_id', '_rev', 'table', 'type', 'products']
    );
    q.pipe(
      take(1),
      catchError((_) => of([]))
    ).subscribe((prodConsumedDocs) => {
      if (prodConsumedDocs.length === 0) {
        let doc: ProductsConsumedDoc = {
          _id: uuidv4(),
          type: 'products-consumed',
          table: tableId,
          products: [],
        };
        this.updateProductsConsumed(doc);
        console.warn('created doc');
        console.warn(doc);
        this.prodConsumedSubject.next([doc]);
      } else {
        this.prodConsumedSubject.next(prodConsumedDocs);
      }
    });
  }

  getProductsConsumed() {
    return this.prodConsumedSubject.asObservable();
  }

  updateProductsConsumed(doc: ProductsConsumedDoc) {
    this.dbService.createOrUpdate(doc);
    // this.dbService.db.put(doc).catch((err: any) => {
    //   console.error(err);
    // });
  }
}
