import { TestBed, inject } from '@angular/core/testing';

import { SensorManagementService } from './sensor-management.service';

describe('SensorManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SensorManagementService]
    });
  });

  it('should be created', inject([SensorManagementService], (service: SensorManagementService) => {
    expect(service).toBeTruthy();
  }));
});
