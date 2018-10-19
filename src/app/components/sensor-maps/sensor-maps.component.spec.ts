import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorMapsComponent } from './sensor-maps.component';

describe('SensorMapsComponent', () => {
  let component: SensorMapsComponent;
  let fixture: ComponentFixture<SensorMapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorMapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
