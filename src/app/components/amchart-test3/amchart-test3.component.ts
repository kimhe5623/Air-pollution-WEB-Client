import { Component, OnInit, NgZone } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'app-amchart-test3',
  templateUrl: './amchart-test3.component.html',
  styleUrls: ['./amchart-test3.component.css']
})
export class AmchartTest3Component implements OnInit {

  checkbox: any = {
    all: true,
    temp: true,
    co: true,
    o3: true,
    no2: true,
    so2: true,
    pm25: true,
    pm10: true
  }

  private chart: am4charts.XYChart;

  constructor(private zone: NgZone) { }


  showValue(idx: number){
    this.chart.series.values[idx].show();
  }
  hideValue(idx: number){
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
          for(var key in this.checkbox) this.checkbox[key] = true;
          for (var i = 0; i < this.chart.series.values.length; i++) this.showValue(i);
        }
        else {
          for(var key in this.checkbox) this.checkbox[key] = false;
          for (var i = 0; i < this.chart.series.values.length; i++) this.hideValue(i);
        }
        break;

      case('temp'):
        if (this.checkbox.temp) this.showValue(0)
        else {
          this.checkbox.all = false;
          this.hideValue(0);
        }
        break;
        
      case ('co'):
        if (this.checkbox.co) this.showValue(1);
        else {
          this.checkbox.all = false;
          this.hideValue(1);
        }
        break;

      case ('o3'):
        if (this.checkbox.o3) this.showValue(2);
        else {
          this.checkbox.all = false;
          this.hideValue(2);
        }
        break;

      case ('no2'):
        if (this.checkbox.no2)  this.showValue(3);
        else {
          this.checkbox.all = false;
          this.hideValue(3);
        }
        break;

      case ('so2'):
        if (this.checkbox.so2)  this.showValue(4);
        else {
          this.checkbox.all = false;
          this.hideValue(4);
        }
        break;

      case ('pm25'):
        if (this.checkbox.pm25) this.showValue(5);
        else {
          this.checkbox.all = false;
          this.hideValue(5);
        }
        break;

      case ('pm10'):
        if (this.checkbox.pm10) this.showValue(6);
        else {
          this.checkbox.all = false;
          this.hideValue(6);
        }
        break;

    }
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {

      am4core.useTheme(am4themes_animated);

      let chart = am4core.create("chartdiv3", am4charts.XYChart);

      chart.data = this.generatingChartData();

      chart.paddingRight = 20;



      // Create axes
      var dateX = chart.xAxes.push(new am4charts.DateAxis());
      dateX.dataFields.date = "timestamp";
      dateX.title.text = "Timestamp";
      dateX.baseInterval = { timeUnit: 'second', count: 3 };
      dateX.align = 'center';

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

      console.log('series_Temp => ', series_Temp);
      
      // AQI - CO
      var series_CO = chart.series.push(new am4charts.LineSeries());
      series_CO.dataFields.valueY = "CO";
      series_CO.dataFields.dateX = "timestamp";
      series_CO.name = "CO";
      series_CO.strokeWidth = 3;
      series_CO.tooltipText = "{name}: [bold]{valueY}[/]";
      series_CO.yAxis = valueAxis_AQI;
      series_CO.fill = new am4core.Color({ r: 233, g: 146, b: 146, a: 1 });
      series_CO.stroke = new am4core.Color({ r: 233, g: 146, b: 146, a: 1 });


      // AQI - O3
      var series_O3 = chart.series.push(new am4charts.LineSeries());
      series_O3.dataFields.valueY = "O3";
      series_O3.dataFields.dateX = "timestamp";
      series_O3.name = "O[sub]3[/]";
      series_O3.strokeWidth = 3;
      series_O3.tooltipText = "{name}: [bold]{valueY}[/]";
      series_O3.yAxis = valueAxis_AQI;
      series_O3.fill = new am4core.Color({ r: 224, g: 146, b: 233, a: 1 });
      series_O3.stroke = new am4core.Color({ r: 224, g: 146, b: 233, a: 1 });

      // AQI - NO2
      var series_NO2 = chart.series.push(new am4charts.LineSeries());
      series_NO2.dataFields.valueY = "NO2";
      series_NO2.dataFields.dateX = "timestamp";
      series_NO2.name = "NO[sub]2[/]";
      series_NO2.strokeWidth = 3;
      series_NO2.tooltipText = "{name}: [bold]{valueY}[/]";
      series_NO2.yAxis = valueAxis_AQI;
      series_NO2.fill = new am4core.Color({ r: 144, g: 162, b: 217, a: 1 });
      series_NO2.stroke = new am4core.Color({ r: 224, g: 146, b: 233, a: 1 });

      // AQI - SO2
      var series_SO2 = chart.series.push(new am4charts.LineSeries());
      series_SO2.dataFields.valueY = "SO2";
      series_SO2.dataFields.dateX = "timestamp";
      series_SO2.name = "SO[sub]2[/]";
      series_SO2.strokeWidth = 3;
      series_SO2.tooltipText = "{name}: [bold]{valueY}[/]";
      series_SO2.yAxis = valueAxis_AQI;
      series_SO2.fill = new am4core.Color({ r: 144, g: 203, b: 217, a: 1 });
      series_SO2.stroke = new am4core.Color({ r: 144, g: 203, b: 217, a: 1 });

      // AQI - PM2.5
      var series_PM25 = chart.series.push(new am4charts.LineSeries());
      series_PM25.dataFields.valueY = "PM25";
      series_PM25.dataFields.dateX = "timestamp";
      series_PM25.name = "PM2.5";
      series_PM25.strokeWidth = 3;
      series_PM25.tooltipText = "{name}: [bold]{valueY}[/]";
      series_PM25.yAxis = valueAxis_AQI;
      series_PM25.fill = new am4core.Color({ r: 159, g: 213, b: 178, a: 1 });
      series_PM25.stroke = new am4core.Color({ r: 159, g: 213, b: 178, a: 1 });

      // AQI - PM10
      var series_PM10 = chart.series.push(new am4charts.LineSeries());
      series_PM10.dataFields.valueY = "PM10";
      series_PM10.dataFields.dateX = "timestamp";
      series_PM10.name = "PM10";
      series_PM10.strokeWidth = 3;
      series_PM10.tooltipText = "{name}: [bold]{valueY}[/]";
      series_PM10.yAxis = valueAxis_AQI;
      series_PM10.fill = new am4core.Color({ r: 231, g: 188, b: 166, a: 1 });
      series_PM10.stroke = new am4core.Color({ r: 231, g: 188, b: 166, a: 1 });

      // Add cursor
      chart.cursor = new am4charts.XYCursor();


      // Add horizotal scrollbar with preview
      var scrollbarX = new am4charts.XYChartScrollbar();

      scrollbarX.series.push(series_Temp);
      scrollbarX.series.push(series_CO);

      chart.scrollbarX = scrollbarX;
      chart.scrollbarX.parent = chart.bottomAxesContainer;


      // mouseZoom enable
      chart.mouseWheelBehavior = "zoomX";

      chart.events.on("doublehit", (ev) => {
        console.log(ev);
      });

      chart.events.on("toggled", (ev) => {
        console.log(ev);
      });

      this.chart = chart;

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
        mac: '12:F1:D3:22:9C:FF',
        activation: 2,
        latitude: 32.8824726,
        longitude: -117.23483890000001,
        timestamp: new Date(startDate + i * 3000),
        temperature: Math.floor(Math.random() * 50 + 10),
        CO: Math.random() * 500 + 0,
        O3: Math.random() * 500 + 0,
        NO2: Math.random() * 500 + 0,
        SO2: Math.random() * 500 + 0,
        PM25: Math.random() * 500 + 0,
        PM10: Math.random() * 500 + 0,
        AQI_CO: Math.floor(Math.random() * 500 + 0),
        AQI_O3: Math.floor(Math.random() * 500 + 0),
        AQI_NO2: Math.floor(Math.random() * 500 + 0),
        AQI_SO2: Math.floor(Math.random() * 500 + 0),
        AQI_PM25: Math.floor(Math.random() * 500 + 0),
        AQI_PM10: Math.floor(Math.random() * 500 + 0),
      });
    }

    console.log(data);
    return data;
  }
}

declare type checkType = "all" | "temp" | "co" | "o3" | "no2" | "so2" | "pm25" | "pm10";