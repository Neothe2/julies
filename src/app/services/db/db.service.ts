import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProductsDoc } from 'src/app/model/products';
import { ProductsConsumedDoc } from 'src/app/model/productsConsumed';
import { TableDoc } from 'src/app/model/table';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  db: any;
  remote: any;

  _tablesSubject = new Subject<TableDoc>();
  _prodConsumedSubject = new Subject<ProductsConsumedDoc>();
  _productsSubject = new Subject<ProductsDoc>();

  constructor() {
    PouchDB.plugin(PouchDBFind);
    this.db = new PouchDB('julies2');
    this.remote = 'http://admin:admin@localhost:5984/julies2';
    const options = {
      live: true,
      retry: true,
    };
    this.db.sync(this.remote, options).catch((err: any) => {
      console.error(err);
    });
    this.db
      .changes({
        since: 'now',
        live: true,
        include_docs: true,
      })
      .on('change', (change: any) => {
        console.warn(change.doc);

        if (change.doc.type === 'table') {
          console.warn('Change detected on table document');
          this._tablesSubject.next(change.doc);
        } else if (change.doc.type === 'products-consumed') {
          console.warn('Change detected on consumed products document');
          this._prodConsumedSubject.next(change.doc);
        } else if (change.doc.type === 'products') {
          console.warn('Change detected on products document');
          this._productsSubject.next(change.doc);
        }
      });
  }

  getAllProductChanges() {
    return this._productsSubject.asObservable();
  }

  getCurrentTableChanges() {
    return this._tablesSubject.asObservable();
  }

  getCurrentConsumedProductChanges() {
    return this._prodConsumedSubject.asObservable();
  }

  handleChange<T extends { _id?: string }>(
    subject: BehaviorSubject<Array<T>>,
    changedDoc: any,
    updateManually: Function
  ) {
    let docs = subject.getValue();
    console.log(changedDoc);
    console.warn(docs);
    var idx = docs.findIndex((x: T) => x._id === changedDoc._id);
    console.warn(idx);

    if (idx === -1) {
      updateManually();
      return;
    }
    docs[idx] = changedDoc;
    console.warn(docs);
    subject.next(docs);
  }
}
