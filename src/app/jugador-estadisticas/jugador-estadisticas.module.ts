import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JugadorEstadisticasPage } from './jugador-estadisticas.page';
import { MatExpansionModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: JugadorEstadisticasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
  ],
  declarations: [JugadorEstadisticasPage]
})
export class JugadorEstadisticasPageModule {}
