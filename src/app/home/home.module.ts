import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { SharedModule } from '../shared/shared.module';
import { ControlMessagesComponent } from 'src/components/control-messages/control-messages.component';
import { CrudJugadorPage } from '../crud-jugador/crud-jugador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [HomePage, CrudJugadorPage],
  entryComponents:[CrudJugadorPage],
  exports:[ReactiveFormsModule]
})
export class HomePageModule {}
