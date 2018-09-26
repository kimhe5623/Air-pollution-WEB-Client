import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSensorManagementComponent } from './admin-sensor-management.component';

describe('AdminSensorManagementComponent', () => {
  let component: AdminSensorManagementComponent;
  let fixture: ComponentFixture<AdminSensorManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSensorManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSensorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
