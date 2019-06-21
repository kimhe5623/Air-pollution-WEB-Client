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
  columnClasses: any = [
    { 'table_no': true }, // No
    { 'table_mac_address': true }, // Mac address
    { 'table_activation': true }, // Activation
    { 'table_nation': true }, // Nation
    { 'table_state': true },  // State
    { 'table_city': true },  // City
    { 'table_registration_date': true },  // Reg date
  ];
  SENSOR_LIST: PeriodicElement[] = [];
  selection : SelectionModel<PeriodicElement>;
  //index: number = 0;
  existSensor: boolean;
  selectedSensor: any = [];


  //-----(Dialog variables)--------
  senserSerial: string;
  isCanceled: boolean;
  mobility: number;
  reasonCode: number;
  //-------------------------------
  isVisibleRegDateArc: boolean;
  isVisibleGeoDataArc: boolean;
  isVisibleActivationArc: boolean;

  //////////////
  focusedSensorIdx: number = -1;


  constructor(
    public dialog: MatDialog,
    private storageService: StorageService,
    private smService: SensorManagementService,
    private dataService: DataManagementService ) { }


  ngOnInit() {
    this.fnInitData();

    this.windowSize();
    window.onresize = () => {
      this.windowSize();
    }
  }

  windowSize() {
    this.isVisibleRegDateArc = window.innerWidth <= 1640;
    this.isVisibleGeoDataArc = window.innerWidth <= 1200;
    this.isVisibleActivationArc = window.innerWidth <= 1022;
  }

  fnInitData() {
    /** HTTP REQUEST */
    var payload: any = {
      nsc: this.storageService.fnGetNumberOfSignedInCompletions()
    }

    this.selection = new SelectionModel<PeriodicElement>(true, []);

    this.smService.fnSlv(payload, (result) => {

      if (result != null) {

        this.SENSOR_LIST = [];

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
              lat: result.payload.selectedSensorInformationList[i][9],
              lng: result.payload.selectedSensorInformationList[i][10],
            });
          }
        }
      }
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
  fnOpenDialog_SAS_procedure(): void {
    const dialogRef = this.dialog.open(SensorAssociationDialog, {
      width: '400px', height: 'auto',
      data: { sensorSerial: this.senserSerial, mobility: this.mobility, isCanceled: this.isCanceled }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && !result.isCanceled) {
        var payload = {
          nsc: this.storageService.fnGetNumberOfSignedInCompletions(),
          wmac: this.dataService.macAddressToReq(result.sensorSerial),
          mobf: result.mobility
        }

        this.smService.fnSas(payload, (success) => {
          if (success) {
            this.fnInitData();
          }
        });
      }
    });
  }

  fnOpenDialog_SDD_procedure(): void {
    const dialogRef = this.dialog.open(SensorDeletionDialog, {
      width: 'auto', height: 'auto',
      data: { num_of_selected_sensor: this.selection.selected.length, isCanceled: this.isCanceled, reasonCode: this.reasonCode }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && !result.isCanceled) {

        for (var i = 0; i < result.num_of_selected_sensor; i++) {
          var payload = {
            nsc: this.storageService.fnGetNumberOfSignedInCompletions(),
            wmac: this.dataService.macAddressToReq(this.selectedSensor[i].mac),
            drgcd: result.reasonCode.toString()
          }

          this.smService.fnSdd(payload);
        }
        this.fnInitData();
      }
    });
  }
  //--------------------------------

  openSensorArcItem(idx: number) {
    this.focusedSensorIdx = idx;
  }

  closeSensorArcItem(idx: number) {
    if(this.focusedSensorIdx == idx) {
      this.focusedSensorIdx = -1;
    }
  }

  clickSensorMapMarker(idx: number){
    this.focusedSensorIdx = idx;
  }
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
  lat: number;
  lng: number;
}
