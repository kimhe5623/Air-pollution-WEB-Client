import { Component, OnInit } from '@angular/core';
import { UnitsType } from 'src/app/components/temperature/temperature.component';
import { DataMonitoringService } from 'src/app/services/httpRequest/data-monitoring.service';
import { DataManagementService } from 'src/app/services/data-management.service';
import { SessionStorageService } from 'ngx-store';
import { timer } from 'rxjs/observable/timer';

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
  public air_data: Array<any> = [{ data: [], label: '' }];



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

  public airChartColors: Array<any> = [
    {
      backgroundColor: '#aaaaaa00',
      borderColor: '#c77676a0',
      borderWidth: 2,
      pointBackgroundColor: '#c77676a0',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#c77676a0'
    },
    {
      backgroundColor: '#aaaaaa00',
      borderColor: '#ad815ca0',
      borderWidth: 2,
      pointBackgroundColor: '#ad815ca0',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#ad815ca0'
    },
    {
      backgroundColor: '#aaaaaa00',
      borderColor: '#86b470a0',
      borderWidth: 2,
      pointBackgroundColor: '#86b470a0',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#86b470a0'
    },
    {
      backgroundColor: '#aaaaaa00',
      borderColor: '#676db6a0',
      borderWidth: 2,
      pointBackgroundColor: '#676db6a0',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#676db6a0'
    },
    {
      backgroundColor: '#aaaaaa00',
      borderColor: '#a471c2a0',
      borderWidth: 2,
      pointBackgroundColor: '#a471c2a0',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#a471c2a0'
    },
    {
      backgroundColor: '#aaaaaa00',
      borderColor: '#bd7ba9a0',
      borderWidth: 2,
      pointBackgroundColor: '#bd7ba9a0',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#bd7ba9a0'
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
  nearestSensorAddress: string = '';
  nearestSensordata: any = {};
  currentAirdata: any = {};
  currentAirdata_stringfied: string = '';
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
    this.setCurrentHeartdata();
    this.setNearestSensordata();

    // every 5 seconds
    const source = timer(1, 5000);
    //output: 1,2,3,4,5......
    const subscribe = source.subscribe(val => {
      this.setCurrentHeartdata();
    });
  }

  // public chartClicked(e: any): void { }
  // public chartHovered(e: any): void { }

  /**
   * set current heart data
   */
  setCurrentHeartdata() {
    var payload = { nsc: this.sessionStorageService.get('userInfo').nsc };
    this.dmService.RHV(payload, (result) => {
      if (result != null) {
        this.currentHeartdata = result.payload;
        //console.log(this.currentHeartdata);
      }
    });
  }

  /**
   * Set the nearest sensor data from the current location
   */
  setNearestSensordata() {
    this.dataService.getNearestSensorData((data) => {

      if (data != null) {
        console.log('setNearestSensordata: ', data);
        this.dmService.latlngToAddress(data[0]['latitude'], data[0]['longitude'], (address)=>{
          console.log('nearestSensorAddress: ', address);
        });
        
        if (this.nearestSensordata['timestamp']['data'].length > 16) {
          for (var key in this.nearestSensordata) {
            this.nearestSensordata[key]['data'] = this.dataService.extractDataTo(16, this.nearestSensordata[key]['data']);
          }
        }

        // Set temperature data
        this.currentCelsius = this.nearestSensordata['temperature']['data'][this.num_of_data - 1];

        this.temp_cels = [{ data: this.nearestSensordata['temperature']['data'], label: 'Temp (ºC)' }];
        this.temp_fahr = [{ data: this.dataService.CelsiusToFahr(this.temp_cels[0].data), label: 'Temp (ºF)' }];

        this.num_of_data = this.temp_cels[0]['data'].length;

        // Set Air data
        for (var key in this.nearestSensordata) {
          this.currentAirdata[key] = this.nearestSensordata[key]['data'][this.num_of_data - 1];
        }
        console.log(">>main component init");

        this.air_data = [];
        this.air_data.push({ data: this.nearestSensordata['AQI_CO']['data'], label: 'CO AQI' });
        this.air_data.push({ data: this.nearestSensordata['AQI_O3']['data'], label: 'O3 AQI' });
        this.air_data.push({ data: this.nearestSensordata['AQI_NO2']['data'], label: 'NO2 AQI' });
        this.air_data.push({ data: this.nearestSensordata['AQI_SO2']['data'], label: 'SO2 AQI' });
        this.air_data.push({ data: this.nearestSensordata['AQI_PM25']['data'], label: 'PM2.5 AQI' });
        this.air_data.push({ data: this.nearestSensordata['AQI_PM10']['data'], label: 'PM10 AQI' });

        // Label
        this.chartLabels = [];
        for (var i = 0; i < this.num_of_data; i++) {
          this.chartLabels.push(this.dataService.formattingDate(new Date(this.nearestSensordata['timestamp']['data'][i])));
        }
      }

    });
  }

  unitChange(unit: UnitsType) {
    this.currentUnit = unit;
  }

}