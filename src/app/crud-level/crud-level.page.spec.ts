import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudLevelPage } from './crud-level.page';

describe('CrudLevelPage', () => {
  let component: CrudLevelPage;
  let fixture: ComponentFixture<CrudLevelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudLevelPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudLevelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
