import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPersonalSensorRegistrationComponent } from './admin-personal-sensor-registration.component';

describe('AdminPersonalSensorRegistrationComponent', () => {
  let component: AdminPersonalSensorRegistrationComponent;
  let fixture: ComponentFixture<AdminPersonalSensorRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPersonalSensorRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPersonalSensorRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
