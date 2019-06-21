import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorListMapsComponent } from './sensor-list-maps.component';

describe('SensorListMapsComponent', () => {
  let component: SensorListMapsComponent;
  let fixture: ComponentFixture<SensorListMapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorListMapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorListMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
