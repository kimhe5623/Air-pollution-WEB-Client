import { Component, OnInit, ViewChild } from '@angular/core';
import { DataManagementService } from 'src/app/services/data-management.service';
import { DataMonitoringService } from 'src/app/services/httpRequest/data-monitoring.service';
import { FormControl, Validators } from '@angular/forms';
import { } from 'googlemaps';
declare var google;

@Component({
  selector: 'app-air-sensor-history',
  templateUrl: './air-sensor-history.component.html',
  styleUrls: ['./air-sensor-history.component.css']
})
export class AirSensorHistoryComponent implements OnInit {
  /**
   * Slider
   */
  max: number = 1000;
  min: number = 0;
  thumbLabel: boolean = true;
  value: number = 0;

  /**
   * Forms
   */
  startDate: FormControl;
  endDate: FormControl;

  isSearched: boolean = false;

  constructor(
    private dataService: DataManagementService,
    private dmService: DataMonitoringService
  ) { 
    this.startDate = new FormControl(new Date().toISOString(), [Validators.required]);
    this.endDate = new FormControl(new Date().toISOString(), [Validators.required]);
  }

  ngOnInit() { 

  }


  reqData(tlv: any, cb){

  }
  searchHistory(){
    this.isSearched = true;
  }
}
