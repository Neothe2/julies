import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TablesPage } from './tables.page';

const routes: Routes = [
  {
    path: '',
    component: TablesPage,
  },
  {
    path: 'table-details/:id',
    loadChildren: () =>
      import('../table-details/table-details.module').then(
        (m) => m.TableDetailsPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesPageRoutingModule {}
