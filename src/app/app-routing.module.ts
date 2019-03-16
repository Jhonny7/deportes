import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'home-jugador', loadChildren: './home-jugador/home-jugador.module#HomeJugadorPageModule' },
  { path: 'jugador', loadChildren: './jugador/jugador.module#JugadorPageModule' },
  { path: 'jugador-estadisticas', loadChildren: './jugador-estadisticas/jugador-estadisticas.module#JugadorEstadisticasPageModule' },
  { path: 'equipo', loadChildren: './equipo/equipo.module#EquipoPageModule' },
  { path: 'crud-equipo', loadChildren: './crud-equipo/crud-equipo.module#CrudEquipoPageModule' },
  { path: 'crud-level', loadChildren: './crud-level/crud-level.module#CrudLevelPageModule' },
  { path: 'level', loadChildren: './level/level.module#LevelPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
