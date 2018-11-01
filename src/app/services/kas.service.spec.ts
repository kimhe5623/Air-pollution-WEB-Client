import { TestBed, inject } from '@angular/core/testing';

import { KasService } from './kas.service';

describe('KasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KasService]
    });
  });

  it('should be created', inject([KasService], (service: KasService) => {
    expect(service).toBeTruthy();
  }));
});
