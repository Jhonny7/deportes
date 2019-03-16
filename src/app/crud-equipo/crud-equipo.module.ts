import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CrudEquipoPage } from './crud-equipo.page';

const routes: Routes = [
  {
    path: '',
    component: CrudEquipoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CrudEquipoPage]
})
export class CrudEquipoPageModule {}
