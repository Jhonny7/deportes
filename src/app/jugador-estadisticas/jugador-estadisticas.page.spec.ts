import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadorEstadisticasPage } from './jugador-estadisticas.page';

describe('JugadorEstadisticasPage', () => {
  let component: JugadorEstadisticasPage;
  let fixture: ComponentFixture<JugadorEstadisticasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JugadorEstadisticasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JugadorEstadisticasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
