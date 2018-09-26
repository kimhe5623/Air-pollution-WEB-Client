import { TestBed, inject } from '@angular/core/testing';

import { DataMonitoringService } from './data-monitoring.service';

describe('DataMonitoringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataMonitoringService]
    });
  });

  it('should be created', inject([DataMonitoringService], (service: DataMonitoringService) => {
    expect(service).toBeTruthy();
  }));
});
