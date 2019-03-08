import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeJugadorPage } from './home-jugador.page';

describe('HomeJugadorPage', () => {
  let component: HomeJugadorPage;
  let fixture: ComponentFixture<HomeJugadorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeJugadorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeJugadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
