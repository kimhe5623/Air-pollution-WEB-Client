import { Component, OnInit } from '@angular/core';
import { UnitsType } from 'src/app/components/temperature/temperature.component';
import { DataMonitoringService } from 'src/app/services/httpRequest/data-monitoring.service';
import { DataManagementService } from 'src/app/services/data-management.service';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent implements OnInit {

  /**
   * Chart
   */
  public chartType:string = 'line';

  public temp_cels: Array<any> = [{data: [], label: 'Recent 48 hours Temp (ºC)'}];
  public temp_fahr: Array<any> = [{data: [], label: 'Recent 48 hours Temp (ºF)'}];


  public chartLabels:Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  public chartColors:Array<any> = [
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

  public chartOptions:any = {
      responsive: true
  };

  /**
   * Temperature
   */
  currentUnit: UnitsType;


  constructor(
    private dmService: DataMonitoringService,
    private dataService: DataManagementService
  ) { }

  ngOnInit() {
    this.currentUnit = 'C';
  }

  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  unitChange(unit:UnitsType){
    this.currentUnit = unit;
  }

}