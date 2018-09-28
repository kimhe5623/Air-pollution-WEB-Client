import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SensorAssociationDialog } from '../../../../../dialogs/sensor-association-dialog/sensor-association-dialog';
import { SensorDeregistrationDialog } from '../../../../../dialogs/sensor-deregistration-dialog/sensor-deregistration-dialog';
import { StorageService } from 'src/app/services/storage.service';
import { SensorManagementService } from 'src/app/services/httpRequest/sensor-management.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-sensor-management',
  templateUrl: './admin-sensor-management.component.html',
  styleUrls: ['./admin-sensor-management.component.css']
})
export class AdminSensorManagementComponent implements OnInit {
  wifi_mac: FormControl;
  cellular_mac: FormControl;
  searchForm: FormGroup;

  displayedColumns: string[] = ['No.', 'MAC address', 'Activation', 'Nation', 'State', 'City', 'UserID'];
  columnStyles: any = [
    { 'width': '3rem' }, // No
    { 'width': '13rem' }, // Mac address
    { 'width': '8rem' }, // Activation
    { 'width': '4rem' }, // Nation
    { 'width': '4rem' },  // State
    { 'width': '4rem' },  // City
    { 'width': '13rem' }, // UserID
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
    }

    this.smService.ASV(payload, (result) => {
      console.log(result);

      if (result != null) {
        this.existSensor = result.payload.length != 0 ? true : false;
        console.log(this.existSensor);

        this.SENSOR_LIST = result.payload.sensorList;
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
      options: this.search_options_json
    }

    this.smService.ASV(payload, (result) => {
      console.log(result);

      if (result != null) {
        this.existSensor = result.payload.length != 0 ? true : false;
        console.log(this.existSensor);

        this.SENSOR_LIST = result.payload.sensorList;
      }
      else alert('Failed');

    });
  }

  deleteSearchOption(key: string) {
    delete this.search_options_json[key];
    this.jsonToArray(this.search_options_json);
  }

  jsonToArray(json: any) {
    this.search_options_array = [];
    for (var key in json) {
      this.search_options_array.push({ key: key, value: json[key] });
      console.log(this.search_options_array);
    }
  }
  /**--------- */


  /** Sensor Registration */
  onSubmit() {
    var payload = {
      mac: this.wifi_mac.value,
      cellularMac: this.cellular_mac.value,
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
      console.log(result);
      if (result != null && !result.isCanceled) {

        for (var i = 0; i < result.num_of_selected_sensor; i++) {
          var payload = {
            mac: this.selectedSensor[i].mac,
            reasonCode: result.reasonCode
          }
          console.log(payload);

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
  status: string;
  mobility: number;
  userID: string;
}
