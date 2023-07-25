import { Injectable, OnDestroy } from '@angular/core';
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
import { ProductsConsumedDoc } from 'src/app/model/productsConsumed';
import { DbService } from '../db/db.service';
import { ProductsDoc } from 'src/app/model/products';

@Injectable({
  providedIn: 'root',
})
export class ProductsService implements OnDestroy {
  private prodSubject: BehaviorSubject<Array<ProductsDoc>> =
    new BehaviorSubject<Array<ProductsDoc>>(new Array<ProductsDoc>());
  subscriptions: Subscription[] = [];

  constructor(private db: DbService) {
    this.initChangeHandler();
    this.fetchProducts;
  }

  initChangeHandler() {
    let sub = this.db
      .getCurrentProductChanges()
      .subscribe((changeDoc: ProductsDoc) => {
        if (changeDoc) {
          console.log('handlechange called');
          this.db.handleChange(this.prodSubject, changeDoc, () => {
            this.fetchProducts();
          });
        }
      });
    this.subscriptions.push(sub);
  }

  handleChange() {
    this.fetchProducts();
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  fetchProducts() {
    let query = {
      selector: {
        type: 'products',
      },
      fields: ['_id', '_rev', 'type', 'products'],
      execution_status: true,
      limit: 1,
    };
    let q: Observable<any> = from(this.db.db.find(query)).pipe(
      map((obj: any) => obj['docs'])
    );

    q.pipe(
      take(1),
      catchError((_) => of([]))
    ).subscribe((Products: any) => {
      this.prodSubject.next(Products);
    });
  }

  getCurrentProducts() {
    return this.prodSubject.asObservable();
  }
}
