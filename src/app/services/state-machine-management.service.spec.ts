import { TestBed } from '@angular/core/testing';

import { StateMachineManagementService } from './state-machine-management.service';

describe('StateMachineManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StateMachineManagementService = TestBed.get(StateMachineManagementService);
    expect(service).toBeTruthy();
  });
});
