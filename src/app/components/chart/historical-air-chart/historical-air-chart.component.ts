import { Component, OnInit, NgZone, Input, Output, EventEmitter, DoCheck, KeyValueDiffers } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'app-historical-air-chart',
  templateUrl: './historical-air-chart.component.html',
  styleUrls: ['./historical-air-chart.component.css']
})
export class HistoricalAirChartComponent implements OnInit, DoCheck {

  @Input() data: any = [];
  @Input() centerIndex: number = -1;
  @Output() chartClick: EventEmitter<number> = new EventEmitter<number>();

  previousCenterIndex: number = -1;

  checkbox: any = {
    all: true,
    temp: true,
    co: true,
    o3: true,
    no2: true,
    so2: true,
    pm25: true,
    pm10: true
  };

  differ: any;

  private chart: am4charts.XYChart;
  private dateX: am4charts.DateAxis;

  constructor(
    private zone: NgZone,
    private differs: KeyValueDiffers
  ) {
    this.differ = this.differs.find([]).create();
  }

  ngDoCheck() {
    const changes = this.differ.diff([this.data, this.centerIndex]);

    if (changes) {

      if (this.previousCenterIndex != this.centerIndex) {

        this.previousCenterIndex = this.centerIndex;

        var endIndex: number = this.chart.data.length - 1;
        var distance: number = endIndex - this.centerIndex;

        console.log('Entered center index => ', this.centerIndex);

        if (this.centerIndex != -1 && this.chart.data.length > 20) {

          if (this.centerIndex < 10) {
            this.dateX.zoomToDates(this.chart.data[0].timestamp, this.chart.data[10 + (10 - this.centerIndex)].timestamp);
          }
          else if (this.centerIndex > endIndex - 10) {
            this.dateX.zoomToDates(this.chart.data[this.centerIndex - (10 + (10 - distance))].timestamp, this.chart.data[endIndex].timestamp);
          }
          else {
            this.dateX.zoomToDates(this.chart.data[this.centerIndex - 10].timestamp, this.chart.data[this.centerIndex + 10].timestamp);
          }

        }
      }

      else {
        console.log('Entered chart data => ', this.data);
        this.chartDestroy();
        this.chartInit();
      }
    }
  }

  showValue(idx: number) {
    this.chart.series.values[idx].show();
  }
  hideValue(idx: number) {
    this.chart.series.values[idx].hide();
  }

  /**
   * When the checkbox is changed,
   */
  checkboxChanged(ct: checkType) {
    console.log(this.chart);

    switch (ct) {

      case ('all'):
        if (this.checkbox.all) {
          for (var key in this.checkbox) this.checkbox[key] = true;
          for (var i = 0; i < this.chart.series.values.length; i++) this.showValue(i);
        }
        else {
          for (var key in this.checkbox) {
            if (key == 'temp') continue;
            this.checkbox[key] = false;
          }
          for (var i = 0; i < this.chart.series.values.length; i++) {
            if (i == 0) continue;
            this.hideValue(i);
          }
        }
        break;

      case ('temp'):
        if (this.checkbox.temp) {
          if (this.checkbox.co && this.checkbox.o3 && this.checkbox.no2 && this.checkbox.so2 && this.checkbox.pm25 && this.checkbox.pm10) this.checkbox.all = true;
          this.showValue(0);
        }
        else {
          this.checkbox.all = false;
          this.hideValue(0);
        }
        break;

      case ('co'):
        if (this.checkbox.co) {
          if (this.checkbox.temp && this.checkbox.o3 && this.checkbox.no2 && this.checkbox.so2 && this.checkbox.pm25 && this.checkbox.pm10) this.checkbox.all = true;
          this.showValue(1);
        }
        else {
          this.checkbox.all = false;
          this.hideValue(1);
        }
        break;

      case ('o3'):
        if (this.checkbox.o3) {
          if (this.checkbox.temp && this.checkbox.co && this.checkbox.no2 && this.checkbox.so2 && this.checkbox.pm25 && this.checkbox.pm10) this.checkbox.all = true;
          this.showValue(2);
        }
        else {
          this.checkbox.all = false;
          this.hideValue(2);
        }
        break;

      case ('no2'):
        if (this.checkbox.no2) {
          if (this.checkbox.temp && this.checkbox.co && this.checkbox.o3 && this.checkbox.so2 && this.checkbox.pm25 && this.checkbox.pm10) this.checkbox.all = true;
          this.showValue(3);
        }
        else {
          this.checkbox.all = false;
          this.hideValue(3);
        }
        break;

      case ('so2'):
        if (this.checkbox.so2) {
          if (this.checkbox.temp && this.checkbox.co && this.checkbox.o3 && this.checkbox.no2 && this.checkbox.pm25 && this.checkbox.pm10) this.checkbox.all = true;
          this.showValue(4);
        }
        else {
          this.checkbox.all = false;
          this.hideValue(4);
        }
        break;

      case ('pm25'):
        if (this.checkbox.pm25) {
          if (this.checkbox.temp && this.checkbox.co && this.checkbox.o3 && this.checkbox.no2 && this.checkbox.so2 && this.checkbox.pm10) this.checkbox.all = true;
          this.showValue(5);
        }
        else {
          this.checkbox.all = false;
          this.hideValue(5);
        }
        break;

      case ('pm10'):
        if (this.checkbox.pm10) {
          if (this.checkbox.temp && this.checkbox.co && this.checkbox.o3 && this.checkbox.no2 && this.checkbox.so2 && this.checkbox.pm25) this.checkbox.all = true;
          this.showValue(6);
        }
        else {
          this.checkbox.all = false;
          this.hideValue(6);
        }
        break;

    }
  }

  ngOnInit() { }

  ngAfterViewInit() {
    console.log('Entered chart data => ', this.data);
    this.chartInit();
  }

  ngOnDestroy() {
    this.chartDestroy();
  }

  chartInit() {
    this.zone.runOutsideAngular(() => {

      am4core.useTheme(am4themes_animated);

      let chart = am4core.create("chartdiv3", am4charts.XYChart);

      chart.data = this.data;

      chart.paddingRight = 20;



      // Create axes
      var dateX = chart.xAxes.push(new am4charts.DateAxis());
      dateX.dataFields.date = "timestamp";
      dateX.title.text = "Timestamp";
      dateX.baseInterval = { timeUnit: 'second', count: 3 };
      dateX.align = 'center';
      this.dateX = dateX;

      // AQI value axis
      var valueAxis_AQI = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis_AQI.title.text = "Air Quality Index";

      // Temp value axis
      var valueAxis_Temp = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis_Temp.title.text = "Temperature";
      valueAxis_Temp.renderer.opposite = true;

      // Temperature
      var series_Temp = chart.series.push(new am4charts.ColumnSeries());
      series_Temp.dataFields.valueY = "temperature";
      series_Temp.dataFields.dateX = "timestamp";
      series_Temp.name = "Temperature";
      series_Temp.tooltipText = "{name}: [bold]{valueY}[/]";
      series_Temp.yAxis = valueAxis_Temp;
      series_Temp.fill = new am4core.Color({ r: 255, g: 230, b: 136, a: 1 });
      series_Temp.stroke = new am4core.Color({ r: 255, g: 230, b: 136, a: 1 });
      series_Temp.columns.template.events.on("hit", (ev) => {
        console.log('Temp => ', ev)
        this.indexEmit(ev.target.dataItem.index);
      }, this);

      //console.log('series_Temp => ', series_Temp);

      // AQI - CO
      var series_CO = chart.series.push(new am4charts.LineSeries());
      series_CO.dataFields.valueY = "AQI_CO";
      series_CO.dataFields.dateX = "timestamp";
      series_CO.name = "CO";
      series_CO.strokeWidth = 3;
      series_CO.tooltipText = "{name}: [bold]{valueY}[/]";
      series_CO.yAxis = valueAxis_AQI;
      series_CO.fill = new am4core.Color({ r: 233, g: 146, b: 146, a: 1 });
      series_CO.stroke = new am4core.Color({ r: 233, g: 146, b: 146, a: 1 });
      series_CO.segments.template.events.on("hit", (ev) => {
        console.log('CO => ', ev)
        this.indexEmit(ev.target.dataItem.component.tooltipDataItem.index);
      }, this);


      // AQI - O3
      var series_O3 = chart.series.push(new am4charts.LineSeries());
      series_O3.dataFields.valueY = "AQI_O3";
      series_O3.dataFields.dateX = "timestamp";
      series_O3.name = "O[sub]3[/]";
      series_O3.strokeWidth = 3;
      series_O3.tooltipText = "{name}: [bold]{valueY}[/]";
      series_O3.yAxis = valueAxis_AQI;
      series_O3.fill = new am4core.Color({ r: 224, g: 146, b: 233, a: 1 });
      series_O3.stroke = new am4core.Color({ r: 224, g: 146, b: 233, a: 1 });
      series_O3.segments.template.events.on("hit", (ev) => {
        console.log('O3 => ', ev)
        this.indexEmit(ev.target.dataItem.component.tooltipDataItem.index);
      }, this);

      // AQI - NO2
      var series_NO2 = chart.series.push(new am4charts.LineSeries());
      series_NO2.dataFields.valueY = "AQI_NO2";
      series_NO2.dataFields.dateX = "timestamp";
      series_NO2.name = "NO[sub]2[/]";
      series_NO2.strokeWidth = 3;
      series_NO2.tooltipText = "{name}: [bold]{valueY}[/]";
      series_NO2.yAxis = valueAxis_AQI;
      series_NO2.fill = new am4core.Color({ r: 144, g: 162, b: 217, a: 1 });
      series_NO2.stroke = new am4core.Color({ r: 144, g: 162, b: 217, a: 1 });
      series_NO2.segments.template.events.on("hit", (ev) => {
        console.log('NO2 => ', ev)
        this.indexEmit(ev.target.dataItem.component.tooltipDataItem.index);
      }, this);

      // AQI - SO2
      var series_SO2 = chart.series.push(new am4charts.LineSeries());
      series_SO2.dataFields.valueY = "AQI_SO2";
      series_SO2.dataFields.dateX = "timestamp";
      series_SO2.name = "SO[sub]2[/]";
      series_SO2.strokeWidth = 3;
      series_SO2.tooltipText = "{name}: [bold]{valueY}[/]";
      series_SO2.yAxis = valueAxis_AQI;
      series_SO2.fill = new am4core.Color({ r: 144, g: 203, b: 217, a: 1 });
      series_SO2.stroke = new am4core.Color({ r: 144, g: 203, b: 217, a: 1 });
      series_SO2.segments.template.events.on("hit", (ev) => {
        console.log('SO2 => ', ev)
        this.indexEmit(ev.target.dataItem.component.tooltipDataItem.index);
      }, this);

      // AQI - PM2.5
      var series_PM25 = chart.series.push(new am4charts.LineSeries());
      series_PM25.dataFields.valueY = "AQI_PM25";
      series_PM25.dataFields.dateX = "timestamp";
      series_PM25.name = "PM2.5";
      series_PM25.strokeWidth = 3;
      series_PM25.tooltipText = "{name}: [bold]{valueY}[/]";
      series_PM25.yAxis = valueAxis_AQI;
      series_PM25.fill = new am4core.Color({ r: 159, g: 213, b: 178, a: 1 });
      series_PM25.stroke = new am4core.Color({ r: 159, g: 213, b: 178, a: 1 });
      series_PM25.segments.template.events.on("hit", (ev) => {
        console.log('PM2.5 => ', ev)
        this.indexEmit(ev.target.dataItem.component.tooltipDataItem.index);
      }, this);

      // AQI - PM10
      var series_PM10 = chart.series.push(new am4charts.LineSeries());
      series_PM10.dataFields.valueY = "AQI_PM10";
      series_PM10.dataFields.dateX = "timestamp";
      series_PM10.name = "PM10";
      series_PM10.strokeWidth = 3;
      series_PM10.tooltipText = "{name}: [bold]{valueY}[/]";
      series_PM10.yAxis = valueAxis_AQI;
      series_PM10.fill = new am4core.Color({ r: 231, g: 188, b: 166, a: 1 });
      series_PM10.stroke = new am4core.Color({ r: 231, g: 188, b: 166, a: 1 });
      series_PM10.segments.template.events.on("hit", (ev) => {
        console.log('PM10 => ', ev)
        this.indexEmit(ev.target.dataItem.component.tooltipDataItem.index);
      }, this);

      // Add cursor
      chart.cursor = new am4charts.XYCursor();

      // Pre-zooming
      chart.events.on('inited', () => {
        if (chart.data.length > 20) {
          dateX.zoomToDates(chart.data[0].timestamp, chart.data[20].timestamp);
        }
      });


      // Add horizotal scrollbar with preview
      var scrollbarX = new am4charts.XYChartScrollbar();

      scrollbarX.series.push(series_Temp);
      scrollbarX.series.push(series_CO);

      chart.scrollbarX = scrollbarX;
      chart.scrollbarX.parent = chart.bottomAxesContainer;


      // mouseZoom enable
      chart.mouseWheelBehavior = "zoomX";


      this.chart = chart;

    });
  }

  chartDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  indexEmit(event) {
    var index: number = event;
    var endIndex: number = this.chart.data.length - 1;
    var distance: number = endIndex - index;

    console.log(index);
    this.chartClick.emit(index);

    if (this.chart.data.length > 20) {

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