import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalSensorRegComponent } from './personal-sensor-reg.component';

describe('PersonalSensorRegComponent', () => {
  let component: PersonalSensorRegComponent;
  let fixture: ComponentFixture<PersonalSensorRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalSensorRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalSensorRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
