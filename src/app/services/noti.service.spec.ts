import { TestBed } from '@angular/core/testing';

import { NotiService } from './noti.service';

describe('NotiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotiService = TestBed.get(NotiService);
    expect(service).toBeTruthy();
  });
});
