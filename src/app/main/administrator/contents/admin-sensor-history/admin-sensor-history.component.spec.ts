import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSensorHistoryComponent } from './admin-sensor-history.component';

describe('AdminSensorHistoryComponent', () => {
  let component: AdminSensorHistoryComponent;
  let fixture: ComponentFixture<AdminSensorHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSensorHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSensorHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
