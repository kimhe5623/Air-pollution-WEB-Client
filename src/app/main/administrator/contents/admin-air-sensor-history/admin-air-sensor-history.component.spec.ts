import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAirSensorHistoryComponent } from './admin-air-sensor-history.component';

describe('AdminAirSensorHistoryComponent', () => {
  let component: AdminAirSensorHistoryComponent;
  let fixture: ComponentFixture<AdminAirSensorHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAirSensorHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAirSensorHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
