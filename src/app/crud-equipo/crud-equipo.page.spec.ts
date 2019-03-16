import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudEquipoPage } from './crud-equipo.page';

describe('CrudEquipoPage', () => {
  let component: CrudEquipoPage;
  let fixture: ComponentFixture<CrudEquipoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudEquipoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudEquipoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
