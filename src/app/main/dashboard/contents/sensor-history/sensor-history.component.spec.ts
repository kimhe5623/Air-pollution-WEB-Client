import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorHistoryComponent } from './sensor-history.component';

describe('SensorHistoryComponent', () => {
  let component: SensorHistoryComponent;
  let fixture: ComponentFixture<SensorHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
