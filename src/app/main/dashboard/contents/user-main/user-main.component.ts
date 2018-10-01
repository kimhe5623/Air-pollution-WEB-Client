import { Component, OnInit } from '@angular/core';
import { UnitsType } from 'src/app/components/temperature/temperature.component';
import { DataMonitoringService } from 'src/app/services/httpRequest/data-monitoring.service';
import { DataManagementService } from 'src/app/services/data-management.service';
import { SessionStorageService } from 'ngx-store';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent implements OnInit {

  /**
   * Chart
   */
  public chartType: string = 'line';

  public temp_cels: Array<any> = [{ data: [], label: '' }];
  public temp_fahr: Array<any> = [{ data: [], label: '' }];
  public Air_data: Array<any> = [{ data: [], label: '' }];



  public chartLabels: Array<any> = [];

  public chartColors: Array<any> = [
    {
      backgroundColor: '#ffeb9033',
      borderColor: '#ffe190a9',
      borderWidth: 2,
      pointBackgroundColor: '#ffe190a9',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#ffe190a9'
    }
  ];

  public chartOptions: any = {
    responsive: true,
    trackColor: false,
    scales: {
      xAxes: [{
        ticks: {
          display: false //this will remove only the label
        }
      }]
    }
  };

  /**
   * Temperature
   */
  currentUnit: UnitsType;
  currentCelsius: number;
  currentFahrenheit: number;

  /**
   * AQI, Heart data
   */
  nearestSensordata: any = {};
  currentHeartdata: any = {
    heartrate: 0
  };
  num_of_data: number;


  constructor(
    private dmService: DataMonitoringService,
    private dataService: DataManagementService,
    private sessionStorageService: SessionStorageService
  ) { }

  ngOnInit() {
    this.currentUnit = 'C';

    // get current heart data
    var payload = { nsc: this.sessionStorageService.get('userInfo').nsc };
    this.dmService.RHV(payload, (result) => {
      if(result != null){
        this.currentHeartdata = result.payload;
        console.log('currentHEart:' , this.currentHeartdata);
      }
    });

    // get nearest sensor data
    this.dataService.getNearestSensorData((data) => {
      this.nearestSensordata = this.dataService.getChartData(data);
      console.log('nearestSensordata: ', this.nearestSensordata);

      if (this.nearestSensordata['timestamp']['data'].length > 16) {
        for (var key in this.nearestSensordata) {
          this.nearestSensordata[key]['data'] = this.dataService.extractDataTo(16, this.nearestSensordata[key]['data']);
        }
      }

      /** Set temperature data */

      this.currentCelsius = this.nearestSensordata['temperature']['data'][this.num_of_data - 1];

      this.temp_cels = [{ data: this.nearestSensordata['temperature']['data'], label: 'Recent 48 hours Temp (ºC)' }];
      this.temp_fahr = [{ data: this.dataService.CelsiusToFahr(this.temp_cels[0].data), label: 'Recent 48 hours Temp (ºF)' }];

      this.num_of_data = this.temp_cels[0]['data'].length;

      /** Set Air data */
      this.Air_data = [];
      this.Air_data.push({ data: this.nearestSensordata['CO']['data'], label: 'Recent 48 hours CO' });
      this.Air_data.push({ data: this.nearestSensordata['O3']['data'], label: 'Recent 48 hours O3 (µg/m3)' });
      this.Air_data.push({ data: this.nearestSensordata['NO2']['data'], label: 'Recent 48 hours NO2 (ppb)' });
      this.Air_data.push({ data: this.nearestSensordata['SO2']['data'], label: 'Recent 48 hours SO2 (ppb)' });
      this.Air_data.push({ data: this.nearestSensordata['PM25']['data'], label: 'Recent 48 hours PM2.5 (µg/m3)' });
      this.Air_data.push({ data: this.nearestSensordata['PM10']['data'], label: 'Recent 48 hours PM10 (µg/m3)' });

      console.log(this.temp_cels);
      /** Label */
      this.chartLabels = [];
      for (var i = 0; i < this.num_of_data; i++) {
        this.chartLabels.push(this.dataService.formattingDate(new Date(this.nearestSensordata['timestamp']['data'][i])));
      }
      console.log(this.chartLabels);


    });
  }

  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  unitChange(unit: UnitsType) {
    this.currentUnit = unit;
  }

}