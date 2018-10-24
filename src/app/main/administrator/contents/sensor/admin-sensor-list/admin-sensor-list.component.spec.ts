import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSensorListComponent } from './admin-sensor-list.component';

describe('AdminSensorListComponent', () => {
  let component: AdminSensorListComponent;
  let fixture: ComponentFixture<AdminSensorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSensorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSensorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
