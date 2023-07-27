import { Component, OnInit } from '@angular/core';
import { TableDoc } from 'src/app/model/table';
import { TableService } from 'src/app/services/table/table.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.page.html',
  styleUrls: ['./tables.page.scss'],
})
export class TablesPage implements OnInit {
  tables: Array<TableDoc> = new Array<TableDoc>();
  constructor(private tableService: TableService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.tableService.getCurrentTables().subscribe((tableDocs) => {
      this.tables = tableDocs;
    });
    this.tableService.fetchTables();
  }
}
