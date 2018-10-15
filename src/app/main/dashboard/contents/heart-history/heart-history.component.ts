import { Component, OnInit } from '@angular/core';
import { DataMonitoringService } from 'src/app/services/httpRequest/data-monitoring.service';
import { DataManagementService } from 'src/app/services/data-management.service';
import { SessionStorageService } from 'ngx-store';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-heart-history',
  templateUrl: './heart-history.component.html',
  styleUrls: ['./heart-history.component.css']
})
export class HeartHistoryComponent implements OnInit {
  startDate: FormControl;
  endDate: FormControl;

  /**
   * Chart
   */
  public chartType: string = 'line';

  public air_data: Array<any> = [{ data: [], label: '' }];
  public chartLabels: Array<any> = [];
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

  constructor(
    private dmService: DataMonitoringService,
    private dataService: DataManagementService,
    private sessionStorageService: SessionStorageService
  ) { 
    this.startDate = new FormControl('', [Validators.required]);
    this.endDate = new FormControl('', [Validators.required]);
  }

  ngOnInit() {

  }

  reqData() {

  }

  searchHistory(){}
  chartHovered(event){ console.log(event); }
  chartClicked(event){ console.log(event); }

}
