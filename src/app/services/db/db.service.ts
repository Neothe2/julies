import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { BehaviorSubject, Subject } from 'rxjs';
import { TableDoc } from 'src/app/model/table';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  db: any;
  remote: any;

  _tablesSubject = new Subject<TableDoc>();

  constructor() {
    PouchDB.plugin(PouchDBFind);
    this.db = new PouchDB('julies2');
    this.remote = 'http://neoj:wolcott123!@localhost:5984/julies2';
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
        if (change.doc.type === 'table') {
          console.warn('Change detected on table document');
          console.warn(change.doc);
          this._tablesSubject.next(change.doc);
        }
      });
  }

  getCurrentTableChanges() {
    return this._tablesSubject.asObservable();
  }

  handleChange<T extends { _id: string }>(
    subject: BehaviorSubject<Array<T>>,
    changeDoc: any,
    updateManually: Function
  ) {
    let docs = subject.getValue();
    let idx = docs.findIndex((x: T) => x._id === changeDoc._id);

    if (idx == -1) {
      console.log('The update is being updated manually! :(');
      updateManually();
    }
    docs[idx] = changeDoc;
    console.warn(docs);
    subject.next(docs);
  }
}
