import { Injectable, OnDestroy } from '@angular/core';
import { DbService } from '../db/db.service';
import {
  BehaviorSubject,
  Subscription,
  Observable,
  from,
  map,
  take,
  catchError,
  of,
} from 'rxjs';
import { TableDoc } from 'src/app/model/table';
import { ProductsConsumedDoc } from 'src/app/model/productsConsumed';

@Injectable({
  providedIn: 'root',
})
export class ProductsConsumedService implements OnDestroy {
  private prodConsumedSubject: BehaviorSubject<Array<ProductsConsumedDoc>> =
    new BehaviorSubject<Array<ProductsConsumedDoc>>(
      new Array<ProductsConsumedDoc>()
    );
  subscriptions: Subscription[] = [];

  constructor(private db: DbService) {
    this.initChangeHandler();
  }

  initChangeHandler() {
    let sub = this.db
      .getCurrentConsumedProductChanges()
      .subscribe((changeDoc: ProductsConsumedDoc) => {
        if (changeDoc) {
          console.log('handlechange called');
          this.db.handleChange(this.prodConsumedSubject, changeDoc, () => {
            this.fetchProductsConsumed();
          });
        }
      });
    this.subscriptions.push(sub);
  }

  handleChange() {
    this.fetchProductsConsumed();
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  fetchProductsConsumed() {
    let query = {
      selector: {
        type: 'products-consumed',
      },
      fields: ['_id', '_rev', 'table', 'type', 'products'],
      execution_status: true,
      limit: 1,
    };
    let q: Observable<any> = from(this.db.db.find(query)).pipe(
      map((obj: any) => obj['docs'])
    );

    q.pipe(
      take(1),
      catchError((_) => of([]))
    ).subscribe((ProductsConsumed: any) => {
      this.prodConsumedSubject.next(ProductsConsumed);
    });
  }

  getCurrentProducts() {
    return this.prodConsumedSubject.asObservable();
  }
}
