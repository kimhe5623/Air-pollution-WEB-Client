import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UnitsType } from 'src/app/components/temperature/temperature.component';
import { DataMonitoringService } from 'src/app/services/httpRequest/data-monitoring.service';
import { DataManagementService } from 'src/app/services/data-management.service';
import { HEADER } from 'src/app/header';
import { StorageService } from 'src/app/services/storage.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { StateMachineManagementService } from 'src/app/services/state-machine-management.service';

@Component({
  selector: 'app-user-main-contents',
  templateUrl: './user-main-contents.component.html',
  styleUrls: ['./user-main-contents.component.css']
})
export class UserMainContentsComponent implements OnInit, OnDestroy {

  public airmapDisplay: boolean = true;

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
  nearestSensorAddress: string = 'No sensor address';
  nearestSensorMac: string = 'No sensor mac address ';
  nearestSensordata: any = {};
  currentAirdata: any = {};
  currentAirdata_stringfied: string = '';
  currentHeartdata: any = {
    ts: 0,
    lat: 0,
    lng: 0,
    hr: 0,
    rr: 0,
    resultCode: 0
  };
  num_of_data: number;

  private interval: any;
  public inInterval: boolean;

  constructor(
    private dmService: DataMonitoringService,
    private dataService: DataManagementService,
    private storageService: StorageService,
    private router: Router,
    private authService: AuthorizationService,
    private stateService: StateMachineManagementService
  ) { }

  ngOnInit() {

    this.inInterval = true;
    this.currentUnit = 'C';
    this.fnSetCurrentHeartdata();
    this.fnSetNearestSensordata();

    // every 5 seconds

    this.interval = setInterval(() => {
      if(this.inInterval){
        this.fnSetCurrentHeartdata();
        this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T554');
      }
    }, HEADER.TIMER.T554);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.inInterval = false;
  }


  /**
   * set current heart data
   */
  fnSetCurrentHeartdata() {
    var payload = { nsc: this.storageService.fnGetNumberOfSignedInCompletions() };
    this.dmService.fnRhv(payload, (result) => {
      if (result != null) {
        this.currentHeartdata = result.payload;
      }
    });
  }

  /**
   * Set the nearest sensor data from the current location
   */
  fnSetNearestSensordata() {
    this.dataService.getNearestSensorData((data) => {

      if (data != null) {
        this.nearestSensorMac = this.dataService.rspToMacAddress(data[0].mac);
        this.dmService.latlngToAddress(data[0]['latitude'], data[0]['longitude'], (address)=>{
          this.nearestSensorAddress = address.results[0].formatted_address;
        });

        this.nearestSensordata = this.dataService.getChartData(data);

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

  clickDetails(w: string){
    var isAdmin: boolean = this.authService.isAdministor(this.storageService.fnGetUserSequenceNumber());
    switch(w){
      case('heartrate'):
        if(isAdmin) {
          this.router.navigate(['/administrator/heart-history']);
        }
        else this.router.navigate(['/dashboard/heart-history']);
        break;

      case('airquality'):
        if(isAdmin){
          this.router.navigate(['/administrator/air-history']);
        }
        else this.router.navigate(['/dashboard/air-history']);
        break;
    }
  }

}