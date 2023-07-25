export class TableDoc {
  _id: string = '';
  _rev: string = '';
  type: string = 'table';
  table: Table = new Table();
}

class Table {
  id: string = '';
  guests: number = 0;
  state: string = 'free';
}
