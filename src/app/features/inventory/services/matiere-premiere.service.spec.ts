import { TestBed } from '@angular/core/testing';

import { MatierePremiereService } from './matiere-premiere.service';

describe('MatierePremiereService', () => {
  let service: MatierePremiereService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatierePremiereService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
