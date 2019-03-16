import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoPage } from './equipo.page';

describe('EquipoPage', () => {
  let component: EquipoPage;
  let fixture: ComponentFixture<EquipoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
