import { TestBed } from '@angular/core/testing';

import { GenericService } from './generic-service.service';

describe('GenericServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenericService = TestBed.get(GenericService);
    expect(service).toBeTruthy();
  });
});
