import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudJugadorPage } from './crud-jugador.page';

describe('CrudJugadorPage', () => {
  let component: CrudJugadorPage;
  let fixture: ComponentFixture<CrudJugadorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudJugadorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudJugadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
