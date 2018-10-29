import { Component, OnInit, NgZone } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'app-realtime-air-chart',
  templateUrl: './realtime-air-chart.component.html',
  styleUrls: ['./realtime-air-chart.component.css']
})
export class RealtimeAirChartComponent implements OnInit {

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

  private chart: any = {}

  constructor(private zone: NgZone) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {

      this.chart.temp = am4core.create("chartdiv2_1", am4charts.XYChart),
        this.chart.co = am4core.create("chartdiv2_2", am4charts.XYChart),
        this.chart.o3 = am4core.create("chartdiv2_3", am4charts.XYChart),
        this.chart.no2 = am4core.create("chartdiv2_4", am4charts.XYChart),
        this.chart.so2 = am4core.create("chartdiv2_5", am4charts.XYChart),
        this.chart.pm25 = am4core.create("chartdiv2_6", am4charts.XYChart),
        this.chart.pm10 = am4core.create("chartdiv2_7", am4charts.XYChart)

      for (var key in this.chart) {

        this.chart[key].data = this.initChartData();
        this.chart[key].paddingRight = 20;

        // Create xAxes
        var dateX = this.chart[key].xAxes.push(new am4charts.DateAxis());
        dateX.dataFields.date = "timestamp";
        //dateX.title.text = "Timestamp";
        dateX.baseInterval = { timeUnit: 'second', count: 1 };
        dateX.align = 'center';

        // Create yAxis
        var valueAxis = this.chart[key].yAxes.push(new am4charts.ValueAxis());
        valueAxis.rangeChangeDuration = 0;

        if (key != 'temp') {
          // Create AQI range grid
          var gridWidth = 0.4; var gridOpacity = 0.5
          var range = valueAxis.axisRanges.create();
          range.value = 0; // start of good
          range.grid.stroke = am4core.color("#33e081");
          range.grid.strokeWidth = gridWidth;
          range.grid.strokeOpacity = gridOpacity;

          range = valueAxis.axisRanges.create();
          range.value = 51; // start of moderate
          range.grid.stroke = am4core.color("#ebe841");

          range = valueAxis.axisRanges.create();
          range.value = 101; // start of unhealthy for sensitive groups
          range.grid.stroke = am4core.color("#f19040");

          range = valueAxis.axisRanges.create();
          range.value = 151; // start of unhealthy
          range.grid.stroke = am4core.color("#ec4545");

          range = valueAxis.axisRanges.create();
          range.value = 201; // start of very unhealthy
          range.grid.stroke = am4core.color("#b046e0");

          range = valueAxis.axisRanges.create();
          range.value = 301; // start of hazardous
          range.grid.stroke = am4core.color("#6b132e");
        }

        switch (key) {

          case ('temp'): // Temperature
            valueAxis.title.text = "Temperature"

            var series = this.chart[key].series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = "temperature";
            series.dataFields.dateX = "timestamp";
            series.name = "Temperature";
            series.tooltipText = "{name}: [bold]{valueY}[/]";
            series.yAxis = valueAxis;
            series.interpolationDuration = 0;
            series.fill = new am4core.Color({ r: 255, g: 230, b: 136, a: 1 });
            series.stroke = new am4core.Color({ r: 255, g: 230, b: 136, a: 1 });

            console.log('series_Temp => ', series);
            break;

          case ('co'): // AQI - CO
            valueAxis.title.text = "AQI - CO"
            var series = this.chart[key].series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "AQI_CO";
            series.dataFields.dateX = "timestamp";
            series.name = "CO";
            series.strokeWidth = 3;
            series.tooltipText = "{name}: [bold]{valueY}[/]";
            series.yAxis = valueAxis;
            series.interpolationDuration = 0;
            break;

          case ('o3'): // AQI - O3
            valueAxis.title.text = "AQI - O3"

            var series = this.chart[key].series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "AQI_O3";
            series.dataFields.dateX = "timestamp";
            series.name = "O[sub]3[/]";
            series.strokeWidth = 3;
            series.tooltipText = "{name}: [bold]{valueY}[/]";
            series.yAxis = valueAxis;
            series.interpolationDuration = 0;
            break;

          case ('no2'):  // AQI - NO2
            valueAxis.title.text = "AQI - NO2"

            var series = this.chart[key].series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "AQI_NO2";
            series.dataFields.dateX = "timestamp";
            series.name = "NO[sub]2[/]";
            series.strokeWidth = 3;
            series.tooltipText = "{name}: [bold]{valueY}[/]";
            series.yAxis = valueAxis;
            series.interpolationDuration = 0;
            break;

          case ('so2'):  // AQI - SO2
            valueAxis.title.text = "AQI - SO2"

            var series = this.chart[key].series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "AQI_SO2";
            series.dataFields.dateX = "timestamp";
            series.name = "SO[sub]2[/]";
            series.strokeWidth = 3;
            series.tooltipText = "{name}: [bold]{valueY}[/]";
            series.yAxis = valueAxis;
            series.interpolationDuration = 0;
            break;

          case ('pm25'): // AQI - PM2.5
            valueAxis.title.text = "AQI - PM2.5"

            var series = this.chart[key].series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "AQI_PM25";
            series.dataFields.dateX = "timestamp";
            series.name = "PM2.5";
            series.strokeWidth = 3;
            series.tooltipText = "{name}: [bold]{valueY}[/]";
            series.yAxis = valueAxis;
            series.interpolationDuration = 0;
            break;

          case ('pm10'): // AQI - PM10
            valueAxis.title.text = "AQI - PM10"
            var series = this.chart[key].series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "AQI_PM10";
            series.dataFields.dateX = "timestamp";
            series.name = "PM10";
            series.strokeWidth = 3;
            series.tooltipText = "{name}: [bold]{valueY}[/]";
            series.yAxis = valueAxis;
            series.interpolationDuration = 0;
            break;
        }

        if (key != 'temp') {
          // Create yAxis Range. Only if the Key is related to AQI
          var range_good = valueAxis.createSeriesRange(series);
          range_good.value = 0;
          range_good.endValue = 50;
          range_good.contents.stroke = am4core.color("#33e081");

          var range_moderate = valueAxis.createSeriesRange(series);
          range_moderate.value = 51;
          range_moderate.endValue = 100;
          range_moderate.contents.stroke = am4core.color("#ebe841");

          var range_unhealthy_1 = valueAxis.createSeriesRange(series);
          range_unhealthy_1.value = 101;
          range_unhealthy_1.endValue = 150;
          range_unhealthy_1.contents.stroke = am4core.color("#f19040");

          var range_unhealthy_2 = valueAxis.createSeriesRange(series);
          range_unhealthy_2.value = 151;
          range_unhealthy_2.endValue = 200;
          range_unhealthy_2.contents.stroke = am4core.color("#ec4545");

          var range_unhealthy_3 = valueAxis.createSeriesRange(series);
          range_unhealthy_3.value = 201;
          range_unhealthy_3.endValue = 300;
          range_unhealthy_3.contents.stroke = am4core.color("#b046e0");

          var range_hazardous = valueAxis.createSeriesRange(series);
          range_hazardous.value = 301;
          range_hazardous.endValue = 500;
          range_hazardous.contents.stroke = am4core.color("#6b132e");
          range_hazardous.contents.fill = am4core.color("#ffffff");



          console.log(key, "series After range setting => ", series);

        }


        // Add cursor
        this.chart[key].cursor = new am4charts.XYCursor();


        this.chart[key].events.on("doublehit", (ev) => {
          console.log(ev);
        });
      }


    });

    // every 5 seconds
    const source = timer(1, 1000);
    //output: 1,2,3,4,5......
    const subscribe = source.subscribe(val => {
      if (val % 1 == 0)
        this.addChartData();
    });
  }



  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  initChartData(): any {
    var tsp: number = new Date().getTime();
    var data: any = [];

    for (var i = 1; i <= 19; i++) {
      data.push({
        AQI_CO: 0,
        AQI_O3: 0,
        AQI_NO2: 0,
        AQI_SO2: 0,
        AQI_PM25: 0,
        AQI_PM10: 0,
        temperature: 0,
        timestamp: new Date(tsp - 1000 * (19 - i))
      });
    }

    return data;
  }

  addChartData() {
    for (var key in this.chart) {

      if (this.chart[key].data.length > 20) {
        this.chart[key].data.shift();
      }

      this.chart[key].data.push({
        mac: '12:F1:D3:22:9C:FF',
        activation: 2,
        latitude: 32.8824726,
        longitude: -117.23483890000001,
        timestamp: new Date(),
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

      this.chart[key].validateData();

      //console.log(key, ' => ', this.chart[key].data);
    }
  }
}
