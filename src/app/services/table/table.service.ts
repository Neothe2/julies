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

@Injectable({
  providedIn: 'root',
})
export class TableService {
  tablesSubject: BehaviorSubject<Array<TableDoc>> = new BehaviorSubject(
    new Array<TableDoc>()
  );
  subscriptions: Array<Subscription> = [];

  constructor(private dbService: DbService) {
    this.initChangeHandler();
  }

  initChangeHandler() {
    let sub: Subscription = this.dbService
      .getCurrentTableChanges()
      .subscribe((changeDoc: TableDoc) => {
        if (changeDoc) {
          console.warn('handleChange called');
          this.dbService.handleChange(this.tablesSubject, changeDoc, () => {
            this.fetchTables();
          });
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
    let q: Observable<any> = from(this.dbService.db.find(query)).pipe(
      map((obj: any) => obj['docs'])
    );
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
