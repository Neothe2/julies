import { BehaviorSubject, Observable } from 'rxjs';

export default interface IDBRepository<T> {
  init(): void;
  getDocumentChanges$(): Observable<T>;
  fetchByType(type: string, fields: string[]): Observable<T>;
  fetchByTypeAndTableID(
    type: string,
    tableId: string,
    fields: string[]
  ): Observable<T>;
  handleDocumentChange<T extends { _id?: string }>(
    subject: BehaviorSubject<Array<T>>,
    changedDoc: any,
    updateManually: Function
  ): void;
  createOrUpdate(doc: T): Promise<T>;
}
