import { Component, OnInit, NgZone, Output, EventEmitter } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'app-amchart-test4',
  templateUrl: './amchart-test4.component.html',
  styleUrls: ['./amchart-test4.component.css']
})
export class AmchartTest4Component implements OnInit {

  @Output() chartClick: EventEmitter<number> = new EventEmitter<number>();

  private chart: am4charts.XYChart;
  private dateX: am4charts.DateAxis;


  constructor(private zone: NgZone) { }


  ngOnInit() { }

  ngAfterViewInit() {

    this.chartInit();

  }

  chartInit() {
    this.zone.runOutsideAngular(() => {

      am4core.useTheme(am4themes_animated);

      let chart = am4core.create("chartdiv4", am4charts.XYChart);
      let chartData = this.generatingChartData();
      chart.data = chartData;
      chart.paddingRight = 20;

      // Create axes
      var dateX = chart.xAxes.push(new am4charts.DateAxis());
      dateX.dataFields.date = "timestamp";
      dateX.title.text = "Timestamp";
      dateX.baseInterval = { timeUnit: 'second', count: 3 };
      dateX.align = 'center';
      this.dateX = dateX;

      // Heart rate value axis
      var valueAxis_hr = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis_hr.title.text = "Heart rate";


      // Heart rate
      var series_hr = chart.series.push(new am4charts.LineSeries());
      series_hr.dataFields.valueY = "heartrate";
      series_hr.dataFields.dateX = "timestamp";
      series_hr.name = "Heart rate";
      series_hr.strokeWidth = 3;
      series_hr.tooltipText = "{name}: [bold]{valueY} bpm[/]";
      series_hr.yAxis = valueAxis_hr;
      series_hr.fill = new am4core.Color({ r: 233, g: 146, b: 146, a: 1 });
      series_hr.stroke = new am4core.Color({ r: 233, g: 146, b: 146, a: 1 });
      series_hr.segments.template.interactionsEnabled = true;
      series_hr.segments.template.events.on("hit", (ev) => {
        console.log('Heart rate => ', ev);
        this.indexEmit(ev.target.dataItem.component.tooltipDataItem.index);
      }, this);


      // Add cursor
      chart.cursor = new am4charts.XYCursor();

      // Pre-zooming
      chart.events.on('inited', () => {
        if(chart.data.length > 20){
          dateX.zoomToDates(chart.data[0].timestamp, chart.data[20].timestamp);
        }
      });



      // Add horizotal scrollbar with preview
      var scrollbarX = new am4charts.XYChartScrollbar();

      scrollbarX.series.push(series_hr);

      chart.scrollbarX = scrollbarX;
      chart.scrollbarX.parent = chart.bottomAxesContainer;


      // mouseZoom enable
      chart.mouseWheelBehavior = "zoomX";
      

      this.chart = chart;
      console.log('this.chart => ', this.chart);

    });
  }



  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  generatingChartData(): any {
    var data = [];
    var startDate = 1540278000000;
    var endDate = 1540356905959;

    for (var i = 0; i < 50; i++) {
      if (startDate + i * 3000 > endDate) break;

      data.push({
        timestamp: new Date(startDate + i * 3000),
        latitude: Math.random() * 500 + 0,
        longitude: Math.random() * 500 + 0,
        heartrate: Math.floor(Math.random() * 500 + 0),
      });
    }

    console.log(data);
    return data;
  }

  indexEmit(event) {
    var index: number = event;
    var endIndex: number = this.chart.data.length - 1;
    var distance: number = endIndex - index;

    console.log(index);
    this.chartClick.emit(index);

    if(this.chart.data.length > 20){

      if (index < 10) {
        this.dateX.zoomToDates(this.chart.data[0].timestamp, this.chart.data[10 + (10 - index)].timestamp);
      }
      else if (index > endIndex - 10) {
        this.dateX.zoomToDates(this.chart.data[index - (10 + (10 - distance))].timestamp, this.chart.data[endIndex].timestamp);
      }
      else {
        this.dateX.zoomToDates(this.chart.data[index - 10].timestamp, this.chart.data[index + 10].timestamp);
      }

    }
  }
}

declare type checkType = "all" | "temp" | "co" | "o3" | "no2" | "so2" | "pm25" | "pm10";