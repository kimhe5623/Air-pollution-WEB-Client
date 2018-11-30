import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalAirChartComponent } from './historical-air-chart.component';

describe('HistoricalAirChartComponent', () => {
  let component: HistoricalAirChartComponent;
  let fixture: ComponentFixture<HistoricalAirChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalAirChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalAirChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
