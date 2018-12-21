import { TestBed, inject } from '@angular/core/testing';

import { DisplayMessageService } from './display-message.service';

describe('DisplayMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DisplayMessageService]
    });
  });

  it('should be created', inject([DisplayMessageService], (service: DisplayMessageService) => {
    expect(service).toBeTruthy();
  }));
});
