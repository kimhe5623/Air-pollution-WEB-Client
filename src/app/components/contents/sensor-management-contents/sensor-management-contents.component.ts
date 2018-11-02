import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SensorAssociationDialog } from 'src/app/dialogs/sensor-association-dialog/sensor-association-dialog';
import { SensorDeletionDialog } from 'src/app/dialogs/sensor-deletion-dialog/sensor-deletion-dialog';
import { StorageService } from 'src/app/services/storage.service';
import { SensorManagementService } from 'src/app/services/httpRequest/sensor-management.service';
import { DataManagementService } from 'src/app/services/data-management.service';

@Component({
  selector: 'app-sensor-management-contents',
  templateUrl: './sensor-management-contents.component.html',
  styleUrls: ['./sensor-management-contents.component.css']
})
export class SensorManagementContentsComponent implements OnInit {
  displayedColumns: string[] = ['No.', 'MAC address', 'Activation', 'Nation', 'State', 'City', 'Registration date'];
  columnStyles: any = [
    { 'width': '3.5rem' }, // No
    { 'width': '14rem' }, // Mac address
    { 'width': '8rem' }, // Activation
    { 'width': '5rem' }, // Nation
    { 'width': '5rem' },  // State
    { 'width': '5rem' },  // City
    { 'width': '15rem' },  // Reg date
  ];
  SENSOR_LIST: PeriodicElement[] = [];
  selection : SelectionModel<PeriodicElement>;
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
    private smService: SensorManagementService,
    private dataService: DataManagementService ) { }


  ngOnInit() {
    this.initData();
  }

  initData() {
    /** HTTP REQUEST */
    var payload: any = {
      nsc: this.storageService.get('userInfo').nsc
    }

    this.selection = new SelectionModel<PeriodicElement>(true, []);
    this.SENSOR_LIST = [];
    this.smService.SLV(payload, (result) => {

      if (result != null) {

        this.existSensor = result.payload.selectedSensorInformationList.length != 0 ? true : false;

        if (this.existSensor) { // exist one or more sensors
          for (var i = 0; i < result.payload.selectedSensorInformationList.length; i++) {
            this.SENSOR_LIST.push({
              mac: this.dataService.rspToMacAddress(result.payload.selectedSensorInformationList[i][0]),
              cellularMac: this.dataService.rspToMacAddress(result.payload.selectedSensorInformationList[i][1]),
              regDate: new Date(Number(result.payload.selectedSensorInformationList[i][2])),
              activation: Number(result.payload.selectedSensorInformationList[i][3]),
              status: this.dataService.sensorStatusParsing(Number(result.payload.selectedSensorInformationList[i][4])),
              mobility: Number(result.payload.selectedSensorInformationList[i][5]),
              nation: result.payload.selectedSensorInformationList[i][6],
              state: result.payload.selectedSensorInformationList[i][7],
              city: result.payload.selectedSensorInformationList[i][8],
            });
          }
          console.log("SENSOR LIST => ", this.SENSOR_LIST);
        }
      }
      else alert('Failed');
    });
  }

  /** Get Sensor Activation */
  getSensorActivation(activation: number): string {
    switch (activation) {
      case (0):
        return "Registered";
      case (1):
        return "Associated";
      case (2):
        return "Operating";
      case (3):
        return "Deregistered";
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
  }
  //------------------------------------

  //------(Dialog functions)--------
  openAssociationDialog(): void {
    const dialogRef = this.dialog.open(SensorAssociationDialog, {
      width: '600px', height: 'auto',
      data: { sensorSerial: this.senserSerial, mobility: this.mobility, isCanceled: this.isCanceled }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && !result.isCanceled) {
        var payload = {
          nsc: this.storageService.get('userInfo').nsc,
          wmac: this.dataService.macAddressToReq(result.sensorSerial),
          mobf: result.mobility
        }

        this.smService.SAS(payload, (success) => {
          if (!success) {
            alert('Failed!');
          }
          else this.initData();
        });
      }
    });
  }

  openDeletionDialog(): void {
    const dialogRef = this.dialog.open(SensorDeletionDialog, {
      width: 'auto', height: 'auto',
      data: { num_of_selected_sensor: this.selection.selected.length, isCanceled: this.isCanceled, reasonCode: this.reasonCode }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && !result.isCanceled) {

        for (var i = 0; i < result.num_of_selected_sensor; i++) {
          var payload = {
            nsc: this.storageService.get('userInfo').nsc,
            wmac: this.dataService.macAddressToReq(this.selectedSensor[i].mac),
            drgcd: result.reasonCode.toString()
          }

          this.smService.SDD(payload, (success) => {
            if(i == result.num_of_selected_sensor){
              console.log("Init data!");
              this.initData();
            }
          });
        }
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
  status: any;
  mobility: number;
}
