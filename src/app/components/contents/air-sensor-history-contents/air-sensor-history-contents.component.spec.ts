import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirSensorHistoryContentsComponent } from './air-sensor-history-contents.component';

describe('AirSensorHistoryContentsComponent', () => {
  let component: AirSensorHistoryContentsComponent;
  let fixture: ComponentFixture<AirSensorHistoryContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirSensorHistoryContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirSensorHistoryContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
