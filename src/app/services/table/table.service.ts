import { Injectable, OnDestroy } from '@angular/core';
import { DbService } from '../db/db.service';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  catchError,
  from,
  map,
  of,
  take,
} from 'rxjs';
import { TableDoc } from 'src/app/model/table';

@Injectable({
  providedIn: 'root',
})
export class TableService implements OnDestroy {
  private tablesSubject: BehaviorSubject<Array<TableDoc>> = new BehaviorSubject<
    Array<TableDoc>
  >(new Array<TableDoc>());
  subscriptions: Subscription[] = [];

  constructor(private db: DbService) {
    this.initChangeHandler();
  }

  initChangeHandler() {
    let sub = this.db
      .getCurrentTableChanges()
      .subscribe((changeDoc: TableDoc) => {
        if (changeDoc) {
          console.log('handlechange called');
          this.db.handleChange(this.tablesSubject, changeDoc, () => {
            this.fetchTables();
          });
        }
      });
    this.subscriptions.push(sub);
  }

  handleChange() {
    this.fetchTables();
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  fetchTables() {
    let query = {
      selector: {
        type: 'table',
      },
      fields: ['_id', '_rev', 'table', 'type'],
      execution_status: true,
    };
    let q: Observable<any> = from(this.db.db.find(query)).pipe(
      map((obj: any) => obj['docs'])
    );

    q.pipe(
      take(1),
      catchError((_) => of([]))
    ).subscribe((tableDocs: any) => {
      this.tablesSubject.next(tableDocs);
    });
  }

  getCurrentTables() {
    return this.tablesSubject.asObservable();
  }
}
