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
import { ProductsDoc } from 'src/app/model/products';
import { DbService } from '../db/db.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  prodSubject: BehaviorSubject<Array<ProductsDoc>> = new BehaviorSubject(
    new Array<ProductsDoc>()
  );
  subscriptions: Array<Subscription> = [];

  constructor(private dbService: DbService) {
    this.fetchProducts();
    this.initChangeHandler();
  }

  initChangeHandler() {
    let sub: Subscription = this.dbService
      .getAllProductChanges()
      .subscribe((changeDoc: ProductsDoc) => {
        if (changeDoc) {
          console.warn('handleChange called');
          this.dbService.handleChange(this.prodSubject, changeDoc, () => {
            this.fetchProducts();
          });
        }
      });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  fetchProducts() {
    console.error('fetchProducts called');
    let query = {
      selector: {
        type: 'products',
      },
      fields: ['_id', '_rev', 'type', 'products'],
      execution_stats: true,
      limit: 1,
    };
    let q: Observable<any> = from(this.dbService.db.find(query)).pipe(
      map((obj: any) => obj['docs'])
    );
    q.pipe(
      take(1),
      catchError((_) => of([]))
    ).subscribe((productsDoc) => {
      this.prodSubject.next(productsDoc);
    });
  }

  getAllProducts() {
    return this.prodSubject.asObservable();
  }
}
