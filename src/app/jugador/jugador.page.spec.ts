import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadorPage } from './jugador.page';

describe('JugadorPage', () => {
  let component: JugadorPage;
  let fixture: ComponentFixture<JugadorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JugadorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JugadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
