import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SensorAssociationDialog } from 'src/app/dialogs/sensor-association-dialog/sensor-association-dialog';
import { SensorDeregistrationDialog } from 'src/app/dialogs/sensor-deregistration-dialog/sensor-deregistration-dialog';
import { StorageService } from 'src/app/services/storage.service';
import { SensorManagementService } from 'src/app/services/httpRequest/sensor-management.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DataManagementService } from 'src/app/services/data-management.service';

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
  columnStyles: any = [
    { 'width': '3rem' }, // No
    { 'width': '12rem' }, // Mac address
    { 'width': '8rem' }, // Activation
    { 'width': '4rem' }, // Nation
    { 'width': '4rem' },  // State
    { 'width': '8rem' },  // City
    { 'width': '15rem' },  // Registration date
    { 'width': '10rem' }, // UserID
  ];

  SENSOR_LIST: PeriodicElement[] = [];
  selection = new SelectionModel<PeriodicElement>(true, []);
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

  constructor(
    public dialog: MatDialog,
    private storageService: StorageService,
    private smService: SensorManagementService,
    private dataService: DataManagementService,
    private fb: FormBuilder) {
    this.wifi_mac = new FormControl('', [Validators.required, Validators.pattern("^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$")]);
    this.cellular_mac = new FormControl('', [Validators.required, Validators.pattern("^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$")]);

    this.searchForm = this.fb.group({
      hideRequired: true,
      floatLabel: 'auto',
      option: ['', Validators.required],
      input: ['', Validators.required]
    });
  }


  ngOnInit() {
    /** HTTP REQUEST */
    var payload: any = {
      nsc: this.storageService.get('userInfo').nsc,
      wmac: "",
      actf: 0,
      mobf: 0,
      nat: "Q30",
      state: "Q99",
      city: "Q16552"
    }

    this.reqData(payload);
  }

  /** request data */
  reqData(payload: any){
    this.smService.ASV(payload, (result) => {

      console.log('ASV-RSP => ', result);
      if (result != null) {
        //console.log('result is not null');
        this.existSensor = result.payload.selectedSensorInformationList.length != 0 ? true : false;
        //console.log('Sensor exist? => ', this.existSensor);

        if(this.SENSOR_LIST.length != 0){
          console.log('pop! =>', this.SENSOR_LIST.length);
          for(var i=0; i<this.SENSOR_LIST.length; i++){
            this.SENSOR_LIST.pop();
          }
          console.log('After poping data => ', this.SENSOR_LIST);
        }

        for(var i=0; i<result.payload.selectedSensorInformationList.length; i++){
          this.SENSOR_LIST.push({
            mac: result.payload.selectedSensorInformationList[i]['wmac'],
            activation: Number(result.payload.selectedSensorInformationList[i]['actf']),
            nation: 122,
            state: 'CA',
            city: 'San diego',
            cellularMac: result.payload.selectedSensorInformationList[i]['cmac'],
            regDate: new Date(Number(result.payload.selectedSensorInformationList[i]['rdt'])),
            status: Number(result.payload.selectedSensorInformationList[i]['stat']),
            mobility: Number(result.payload.selectedSensorInformationList[i]['mobf']),
            userID: result.payload.selectedSensorInformationList[i]['regusn']
          });
        }
        console.log('parsed sensor data => ', this.SENSOR_LIST);

      }
      else alert('Failed');

    });
  }

  /** Search */
  addSearchOption() {
    this.search_options_json[this.searchForm.value.option] = this.searchForm.value.input;
    this.jsonToArray(this.search_options_json);

    var payload: any = {
      nsc: this.storageService.get('userInfo').nsc,
      wmac: this.search_options_json['mac'],
      actf: this.search_options_json['activation'],
      mobf: this.search_options_json['mobility'],
      nat: this.search_options_json['nation'],
      state: this.search_options_json['state'],
      city: this.search_options_json['city']
    }

    console.log(payload);
    this.reqData(payload);
  }

  deleteSearchOption(key: string) {
    delete this.search_options_json[key];
    this.jsonToArray(this.search_options_json);

    var payload: any = {
      nsc: this.storageService.get('userInfo').nsc,
      wmac: this.search_options_json['mac'],
      actf: this.search_options_json['activation'],
      mobf: this.search_options_json['mobility'],
      nat: this.search_options_json['nation'],
      state: this.search_options_json['state'],
      city: this.search_options_json['city']
    }

    console.log(payload);
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
  onSubmit() {
    var payload = {
      nsc: this.storageService.get('userInfo').nsc,
      wmac: this.wifi_mac.value,
      cmac: this.cellular_mac.value,
    }
    var success: boolean = this.smService.ASR(payload);
    if (!success) {
      alert('Failed!');
    }
    else this.ngOnInit();
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
    console.log('Selected! => ', this.selectedSensor);
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
          wmac: result.sensorSerial,
          mobf: result.mobility
        }

        var success = this.smService.SAS(payload);
        if (!success) {
          alert('Failed!');
        }
        else this.ngOnInit();
      }
    });
  }

  openDeletionDialog(): void {
    const dialogRef = this.dialog.open(SensorDeregistrationDialog, {
      width: 'auto', height: 'auto',
      data: { num_of_selected_sensor: this.selection.selected.length, isCanceled: this.isCanceled, reasonCode: this.reasonCode }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && !result.isCanceled) {


        for (var i = 0; i < result.num_of_selected_sensor; i++) {
          var payload = {
            nsc: this.storageService.get('userInfo').nsc,
            wmac: this.selectedSensor[i].mac,
            userId: 'hyon5623@gmail.com',
            //userId: this.selectedSensor[i].userID,
            drgcd: result.reasonCode,
          }

          var success: boolean = true;
          success = success || this.smService.ASD(payload);
        }

        if (!success) alert('Failed!');
        else alert('Successfully deregistered');

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
  status: number;
  mobility: number;
  userID: string;
}
