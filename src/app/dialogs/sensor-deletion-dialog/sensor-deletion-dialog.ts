/** Sensor-association-dialog */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: 'sensor-deletion-dialog.html',
  styleUrls: ['sensor-deletion-dialog.css']
})
export class SensorDeletionDialog {
  constructor(
    public dialogRef: MatDialogRef<SensorDeletionDialog>,
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