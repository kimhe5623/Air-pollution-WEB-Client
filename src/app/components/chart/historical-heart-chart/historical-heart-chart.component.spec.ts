import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalHeartChartComponent } from './historical-heart-chart.component';

describe('HistoricalHeartChartComponent', () => {
  let component: HistoricalHeartChartComponent;
  let fixture: ComponentFixture<HistoricalHeartChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalHeartChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalHeartChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
