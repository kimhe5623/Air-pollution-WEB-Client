/** Sensor-association-dialog */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'sensor-deregistration-dialog',
  templateUrl: 'sensor-deregistration-dialog.html',
  styleUrls: ['sensor-deregistration-dialog.css']
})
export class SensorDeregistrationDialog {
  constructor(
    public dialogRef: MatDialogRef<SensorDeregistrationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.data.isCanceled = true;
    this.data.reasonCode = 0;
  }

  choose(data) {
    this.data.reasonCode = data.value;
  }
  btnClick(isCanceled: boolean) {
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