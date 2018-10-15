import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirSensorHistoryComponent } from './air-sensor-history.component';

describe('AirSensorHistoryComponent', () => {
  let component: AirSensorHistoryComponent;
  let fixture: ComponentFixture<AirSensorHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirSensorHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirSensorHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
