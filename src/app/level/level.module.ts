import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LevelPage } from './level.page';
import { SharedModule } from '../shared/shared.module';
import { CrudLevelPage } from '../crud-level/crud-level.page';

const routes: Routes = [
  {
    path: '',
    component: LevelPage
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
  declarations: [LevelPage, CrudLevelPage],
  entryComponents:[CrudLevelPage],
  exports:[ReactiveFormsModule]
})
export class LevelPageModule {}
