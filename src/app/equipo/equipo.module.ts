import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EquipoPage } from './equipo.page';
import { CrudEquipoPage } from '../crud-equipo/crud-equipo.page';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: EquipoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [EquipoPage, CrudEquipoPage],
  entryComponents:[CrudEquipoPage],
  exports:[ReactiveFormsModule]
})
export class EquipoPageModule {}
