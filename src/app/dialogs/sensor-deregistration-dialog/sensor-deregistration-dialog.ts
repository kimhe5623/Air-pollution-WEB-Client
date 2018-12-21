/** Sensor-association-dialog */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HEADER } from 'src/app/header';

@Component({
  templateUrl: 'sensor-deregistration-dialog.html',
  styleUrls: ['sensor-deregistration-dialog.css']
})
export class SensorDeregistrationDialog {

  isEmpty: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SensorDeregistrationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.data.isCanceled = true;
    this.data.reasonCode = 0;

    this.fnCheckNumOfSelectedSensors();
  }

  fnCheckNumOfSelectedSensors(){
    if(this.data.num_of_selected_sensor == HEADER.EMPTY_VALUE) this.isEmpty = true;
    else this.isEmpty = false;
  }

  choose(data) {
    this.data.reasonCode = data.value;
  }
  fnBtnClick(isCanceled: boolean) {
    this.data.isCanceled = isCanceled;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  isCanceled: boolean;
  num_of_selected_sensor: number;
  reasonCode: number;
}