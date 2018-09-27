import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SensorAssociationDialog } from '../../../../../dialogs/sensor-association-dialog/sensor-association-dialog';
import { SensorDeletionDialog } from '../../../../../dialogs/sensor-deletion-dialog/sensor-deletion-dialog';
import { StorageService } from 'src/app/services/storage.service';
import { SensorManagementService } from 'src/app/services/httpRequest/sensor-management.service';
import { OPERATOR } from 'src/app/header'

@Component({
  selector: 'app-sensor-management',
  templateUrl: './sensor-management.component.html',
  styleUrls: ['./sensor-management.component.css']
})
export class SensorManagementComponent implements OnInit {
  displayedColumns: string[] = ['No.', 'MAC address', 'Activation', 'Nation', 'State', 'City'];
  columnStyles: any = [
    {'width': '3.5rem'}, // No
    {'width': '14rem'}, // Mac address
    {'width': '6.5rem'}, // Activation
    {'width': '5rem'}, // Nation
    {'width': '5rem'},  // State
    {'width': '5rem'},  // City
  ];
  SENSOR_LIST: PeriodicElement[] = [];
  selection = new SelectionModel<PeriodicElement>(true, []);
  index: number = 0;
  existSensor: boolean;
  selectedSensor: any = [];


  //-----(Dialog variables)--------
  senserSerial: string;
  isCanceled: boolean;
  mobility: number;
  reasonCode: number;
  //-------------------------------

  constructor(
    public dialog: MatDialog,
    private storageService: StorageService,
    private smService: SensorManagementService,) { }


  ngOnInit() {
    /** HTTP REQUEST */
    var payload: any = {
      nsc: this.storageService.get('userInfo').nsc
    }

    var success: boolean = this.smService.SLV(payload, (result) => {
      console.log(result);

      this.existSensor = result.payload.existCode == 0 ? true : false;
      console.log(this.existSensor);

      if (this.existSensor) // exist one or more sensors
        this.SENSOR_LIST = result.payload.sensorList;

    });
    if (!success) {
      alert('Failed');
    }
  }

  //------(Selection functions)---------
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.SENSOR_LIST.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.SENSOR_LIST.forEach(row => { this.selection.select(row); });
  }

  selected() {
    this.selectedSensor = this.selection.selected;
    console.log(this.selectedSensor);
  }
  //------------------------------------

  //------(Dialog functions)--------
  openAssociationDialog(): void {
    const dialogRef = this.dialog.open(SensorAssociationDialog, {
      width: '600px', height: 'auto',
      data: { sensorSerial: this.senserSerial, mobility: this.mobility, isCanceled: this.isCanceled }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result != null && !result.isCanceled) {
        var payload = {
          mac: result.sensorSerial,
          mobility: result.mobility
        }
        
        var success = this.smService.SAS(payload);
        if (!success) {
          alert('Failed!');
        }
        else  this.ngOnInit();
      }
    });
  }

  openDeletionDialog(): void {
    const dialogRef = this.dialog.open(SensorDeletionDialog, {
      width: 'auto', height: 'auto',
      data: { num_of_selected_sensor: this.selection.selected.length, isCanceled: this.isCanceled, reasonCode: this.reasonCode }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result != null && !result.isCanceled) {
        
        for(var i=0; i<result.num_of_selected_sensor; i++){
          var payload = {
            mac: this.selectedSensor[i].mac,
            reasonCode: result.reasonCode
          }
          console.log(payload);


          var success: boolean = true;
          success = success || this.smService.SDD(payload);
        }

        if (!success) alert('Failed!');
        else          alert('Successfully diassociated');
        
        this.ngOnInit();
      }
    });
  }
  //--------------------------------
}

export interface PeriodicElement {
  mac: string;
  activation: number;
  nation: number;
  state: string;
  city: string;
  cellularMac: string;
  regDate: Date;
  status: string;
  mobility: number;
}
