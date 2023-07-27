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
import { TableDoc } from 'src/app/model/table';
import { DbService } from '../db/db.service';
import { DBRepository } from 'src/app/db/DB.repository';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  tablesSubject: BehaviorSubject<Array<TableDoc>> = new BehaviorSubject(
    new Array<TableDoc>()
  );
  subscriptions: Array<Subscription> = [];

  constructor(private dbService: DBRepository<any>) {
    this.initChangeHandler();
  }

  initChangeHandler() {
    let sub: Subscription = this.dbService
      .getDocumentChanges$()
      .subscribe((changeDoc: TableDoc) => {
        if (changeDoc) {
          if (changeDoc.type != 'table') return;
          console.warn('handleChange called');
          this.dbService.handleDocumentChange(
            this.tablesSubject,
            changeDoc,
            () => {
              this.fetchTables();
            }
          );
        }
      });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  fetchTables() {
    console.error('fetchTables called');
    let query = {
      selector: {
        type: 'table',
      },
      fields: ['_id', '_rev', 'table', 'type'],
      execution_stats: true,
    };
    // let q: Observable<any> = from(this.dbService.db.find(query)).pipe(
    //   map((obj: any) => obj['docs'])
    // );

    let q = this.dbService.fetchByType('table', [
      '_id',
      '_rev',
      'table',
      'type',
    ]);
    q.pipe(
      take(1),
      catchError((_) => of([]))
    ).subscribe((tableDocs) => {
      this.tablesSubject.next(tableDocs);
    });
  }

  getCurrentTables() {
    return this.tablesSubject.asObservable();
  }
}
