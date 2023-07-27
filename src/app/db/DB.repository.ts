import { BehaviorSubject, Observable } from 'rxjs';
import IDBRepository from './IDB.repository';

export abstract class DBRepository<T> implements IDBRepository<T> {
  constructor() {
    this.init();
  }
  abstract init(): void;
  abstract getDocumentChanges$(): Observable<T>;
  abstract fetchByType(type: string, fields: string[]): Observable<T>;
  abstract fetchByTypeAndTableID(
    type: string,
    tableId: string,
    fields: string[]
  ): Observable<T>;
  abstract handleDocumentChange<T extends { _id?: string | undefined }>(
    subject: BehaviorSubject<T[]>,
    changedDoc: any,
    updateManually: Function
  ): void;
  abstract createOrUpdate(doc: T): Promise<T>;
}
