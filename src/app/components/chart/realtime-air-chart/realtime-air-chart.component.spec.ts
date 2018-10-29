import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeAirChartComponent } from './realtime-air-chart.component';

describe('RealtimeAirChartComponent', () => {
  let component: RealtimeAirChartComponent;
  let fixture: ComponentFixture<RealtimeAirChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealtimeAirChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealtimeAirChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
