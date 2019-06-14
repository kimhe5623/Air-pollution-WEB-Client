import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SensorAssociationDialog } from 'src/app/dialogs/sensor-association-dialog/sensor-association-dialog';
import { SensorDeregistrationDialog } from 'src/app/dialogs/sensor-deregistration-dialog/sensor-deregistration-dialog';
import { StorageService } from 'src/app/services/storage.service';
import { SensorManagementService } from 'src/app/services/httpRequest/sensor-management.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DataManagementService } from 'src/app/services/data-management.service';
import { HEADER } from 'src/app/header';

@Component({
  selector: 'app-admin-sensor-management-contents',
  templateUrl: './admin-sensor-management-contents.component.html',
  styleUrls: ['./admin-sensor-management-contents.component.css']
})
export class AdminSensorManagementContentsComponent implements OnInit {
  wifi_mac: FormControl;
  cellular_mac: FormControl;
  searchForm: FormGroup;

  displayedColumns: string[] = ['No.', 'MAC address', 'Activation', 'Nation', 'State', 'City', 'Registration date', 'UserID'];
  columnClasses: any = [
    { 'table_no': true }, // No
    { 'table_mac_address': true }, // Mac address
    { 'table_activation': true }, // Activation
    { 'table_nation': true }, // Nation
    { 'table_state': true },  // State
    { 'table_city': true },  // City
    { 'table_registration_date': true },  // Reg date
    { 'table_userid': true }, // UserID
  ];

  SENSOR_LIST: PeriodicElement[] = [];
  selection: SelectionModel<PeriodicElement>;
  index: number = 0;
  existSensor: boolean;
  selectedSensor: any = [];

  search_options_array: any = [];
  search_options_json: any = {};


  //-----(Dialog variables)--------
  senserSerial: string;
  isCanceled: boolean;
  mobility: number;
  reasonCode: number;
  //-------------------------------

  isVisibleUseridArc: boolean;
  isVisibleRegDateArc: boolean;
  isVisibleGeoDataArc: boolean;
  isVisibleActivationArc: boolean;

  constructor(
    public dialog: MatDialog,
    private storageService: StorageService,
    private smService: SensorManagementService,
    private dataService: DataManagementService,
    private fb: FormBuilder) {
    this.wifi_mac = new FormControl('', [Validators.required, Validators.pattern("^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$")]);
    this.cellular_mac = new FormControl('', [Validators.required, Validators.pattern("^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$")]);

    this.searchForm = this.fb.group({
      hideRequired: true,
      floatLabel: 'auto',
      option: ['', Validators.required],
      input: ['', Validators.required]
    });
  }


  ngOnInit() {
    this.fnInitData();

    this.windowSize();
    window.onresize = () => {
      this.windowSize();
    }
  }

  windowSize() {
    this.isVisibleUseridArc = window.innerWidth <= 1640;
    this.isVisibleRegDateArc = window.innerWidth <= 1450;
    this.isVisibleGeoDataArc  = window.innerWidth <= 1022;
    this.isVisibleActivationArc = window.innerWidth <= 900;
  }

  fnInitData() {
    this.selection = new SelectionModel<PeriodicElement>(true, []);

    /** HTTP REQUEST */
    var payload: any = {
      nsc: this.storageService.fnGetNumberOfSignedInCompletions(),
      wmac: "",
      actf: 1,
      mobf: 0,
      nat: "Q30",
      state: "Q99",
      city: "Q16552"
    }

    this.reqData(payload);
  }

  /** request data */
  reqData(payload: any) {


    this.smService.fnAsv(payload, (result) => {

      if (result != HEADER.NULL_VALUE) {

        // flush buffer
        this.SENSOR_LIST = [];

        this.existSensor = result.payload.selectedSensorInformationList.length != 0 ? true : false;

        for (var i = 0; i < result.payload.selectedSensorInformationList.length; i++) {
          this.SENSOR_LIST.push({
            mac: this.dataService.rspToMacAddress(result.payload.selectedSensorInformationList[i]['wmac']),
            activation: Number(result.payload.selectedSensorInformationList[i]['actf']),
            // nation: result.payload.selectedSensorInformationList[i]['nat'],
            // statee: result.payload.selectedSensorInformationList[i]['state'],
            // city: result.payload.selectedSensorInformationList[i]['city'],
            nation: 122,
            state: 'CA',
            city: 'San diego',
            cellularMac: this.dataService.rspToMacAddress(result.payload.selectedSensorInformationList[i]['cmac']),
            regDate: new Date(Number(result.payload.selectedSensorInformationList[i]['rdt'])),
            status: this.dataService.sensorStatusParsing(Number(result.payload.selectedSensorInformationList[i]['stat'])),
            mobility: Number(result.payload.selectedSensorInformationList[i]['mobf']),
            userID: result.payload.selectedSensorInformationList[i]['regusn']
          });
        }
      }

    });
  }

  /** Search */
  fnAddSearchOption() {
    this.search_options_json[this.searchForm.value.option] = this.searchForm.value.input;
    this.jsonToArray(this.search_options_json);

    var payload: any = {
      nsc: this.storageService.fnGetNumberOfSignedInCompletions(),
      wmac: this.search_options_json['mac'] == HEADER.NULL_VALUE ? "" : this.dataService.macAddressToReq(this.search_options_json['mac']),
      actf: this.search_options_json['activation'] == HEADER.NULL_VALUE ? "" : Number(this.search_options_json['activation']),
      mobf: this.search_options_json['mobility'] == HEADER.NULL_VALUE ? 0 : Number(this.search_options_json['mobility']),
      nat: this.search_options_json['nation'] == HEADER.NULL_VALUE ? "Q30" : this.search_options_json['nation'],
      state: this.search_options_json['state'] == HEADER.NULL_VALUE ? "Q99" : this.search_options_json['state'],
      city: this.search_options_json['city'] == HEADER.NULL_VALUE ? "Q16552" : this.search_options_json['city'],
    }
    this.reqData(payload);
  }

  fnDeleteSearchOption(key: string) {
    delete this.search_options_json[key];
    this.jsonToArray(this.search_options_json);

    var payload: any = {
      nsc: this.storageService.fnGetNumberOfSignedInCompletions(),
      wmac: this.search_options_json['mac'] == HEADER.NULL_VALUE ? "" : this.search_options_json['mac'],
      actf: this.search_options_json['activation'] == HEADER.NULL_VALUE ? "" : Number(this.search_options_json['activation']),
      mobf: this.search_options_json['mobility'] == HEADER.NULL_VALUE ? 0 : Number(this.search_options_json['mobility']),
      nat: this.search_options_json['nation'] == HEADER.NULL_VALUE ? "Q30" : this.search_options_json['nation'],
      state: this.search_options_json['state'] == HEADER.NULL_VALUE ? "Q99" : this.search_options_json['state'],
      city: this.search_options_json['city'] == HEADER.NULL_VALUE ? "Q16552" : this.search_options_json['city'],
    }
    this.reqData(payload);
  }

  jsonToArray(json: any) {
    this.search_options_array = [];
    for (var key in json) {
      this.search_options_array.push({ key: key, value: json[key] });
    }
  }
  /**--------- */


  /** Sensor Registration */
  fnOnSubmitAsrForm() {
    var payload = {
      nsc: this.storageService.fnGetNumberOfSignedInCompletions(),
      wmac: this.dataService.macAddressToReq(this.wifi_mac.value),
      cmac: this.dataService.macAddressToReq(this.cellular_mac.value),
    }
    this.smService.fnAsr(payload, (success) => {
      if (success) {
        this.fnInitData();
      }
    });
  }
  /**----------------*/

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
  /**---------------------- */



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
      if (result != HEADER.NULL_VALUE && !result.isCanceled) {
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

  fnOpenDialog_ASD_procedure(): void {
    const dialogRef = this.dialog.open(SensorDeregistrationDialog, {
      width: 'auto', height: 'auto',
      data: { num_of_selected_sensor: this.selection.selected.length, isCanceled: this.isCanceled, reasonCode: this.reasonCode }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != HEADER.NULL_VALUE && !result.isCanceled) {

        for (var i = 0; i < result.num_of_selected_sensor; i++) {
          var payload = {
            nsc: this.storageService.fnGetNumberOfSignedInCompletions(),
            wmac: this.dataService.macAddressToReq(this.selectedSensor[i].mac),
            userId: this.selectedSensor[i].userID,
            //userId: 'hyon5623@gmail.com',
            drgcd: result.reasonCode,
          }
          this.smService.fnAsd(payload);
        }
        this.fnInitData();
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
  userID: string;
}
