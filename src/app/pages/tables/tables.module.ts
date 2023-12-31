import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TablesPageRoutingModule } from './tables-routing.module';

import { TableDetailsPageModule } from '../table-details/table-details.module';
import { TablesPage } from './tables.page';
import { ApplicationPipesModule } from 'src/app/modules/application-pipes/application-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TablesPageRoutingModule,
    TableDetailsPageModule,
    ApplicationPipesModule,
  ],
  declarations: [TablesPage],
})
export class TablesPageModule {}
