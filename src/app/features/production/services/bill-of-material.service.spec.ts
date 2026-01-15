import { TestBed } from '@angular/core/testing';

import { BillOfMaterialService } from './bill-of-material.service';

describe('BillOfMaterialService', () => {
  let service: BillOfMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillOfMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
