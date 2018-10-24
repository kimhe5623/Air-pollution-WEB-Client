import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalSensorRegistrationContentsComponent } from './personal-sensor-registration-contents.component';

describe('PersonalSensorRegistrationContentsComponent', () => {
  let component: PersonalSensorRegistrationContentsComponent;
  let fixture: ComponentFixture<PersonalSensorRegistrationContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalSensorRegistrationContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalSensorRegistrationContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
