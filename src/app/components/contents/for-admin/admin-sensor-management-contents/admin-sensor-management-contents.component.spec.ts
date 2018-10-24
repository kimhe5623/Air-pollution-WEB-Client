import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSensorManagementContentsComponent } from './admin-sensor-management-contents.component';

describe('AdminSensorManagementContentsComponent', () => {
  let component: AdminSensorManagementContentsComponent;
  let fixture: ComponentFixture<AdminSensorManagementContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSensorManagementContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSensorManagementContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
