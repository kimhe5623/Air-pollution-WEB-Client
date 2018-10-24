import { Component, OnInit, NgZone } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'app-amchart-test2',
  templateUrl: './amchart-test2.component.html',
  styleUrls: ['./amchart-test2.component.css']
})
export class AmchartTest2Component implements OnInit {


  private chart: am4charts.XYChart;

  constructor(private zone: NgZone) { }

  ngOnInit() { }
  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {

      am4core.useTheme(am4themes_animated);

      let chart = am4core.create("chartdiv2", am4charts.XYChart);

      chart.data = this.generatingChartData();

      chart.paddingRight = 20;

      // Create axes
      var dateX = chart.xAxes.push(new am4charts.DateAxis());
      dateX.dataFields.date = "date";
      dateX.title.text = "timestamp";

      // First value axis
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "VALUE";

      // Second value axis
      var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis2.title.text = "VOLUME";
      valueAxis2.renderer.opposite = true;

      // First series
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "value";
      series.dataFields.dateX = "date";
      series.name = "vvvalue";
      series.tooltipText = "{name} is [bold]{valueY}[/]";
      series.fill = new am4core.Color({r:255, g:0, b:0 , a:0.5});
      series.stroke = new am4core.Color({r:255, g:0, b:0, a:1})

      // Second series
      var series2 = chart.series.push(new am4charts.LineSeries());
      series2.dataFields.valueY = "volume";
      series2.dataFields.dateX = "date";
      series2.name = "vvvolume";
      series2.tooltipText = "{name} is [bold]{valueY}[/]";
      series2.strokeWidth = 3;
      series2.yAxis = valueAxis2;
      series2.fill = new am4core.Color({r:0, g:255, b:0, a:0.5});
      series2.stroke = new am4core.Color({r:0, g:255, b:0, a:1})

      // Add legend
      chart.legend = new am4charts.Legend();

      // Add cursor
      chart.cursor = new am4charts.XYCursor();

      // Add simple vertical scrollbar
      chart.scrollbarY = new am4core.Scrollbar();

      // Add horizotal scrollbar with preview
      var scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

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
    var chartData = [];
    var firstDate = new Date(2012, 0, 1);
    firstDate.setDate(firstDate.getDate() - 1000);
    firstDate.setHours(0, 0, 0, 0);

    var a = 2000;

    for (var i = 0; i < 100; i++) {
      var newDate = new Date(firstDate);
      newDate.setHours(0, i, 0, 0);

      a += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      var b = Math.round(Math.random() * 100000000);

      chartData.push({
        "date": newDate,
        "value": a,
        "volume": b
      });
    }
    return chartData;
  }
}