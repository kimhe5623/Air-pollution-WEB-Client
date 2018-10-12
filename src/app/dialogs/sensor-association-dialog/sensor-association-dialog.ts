/** Sensor-association-dialog */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: 'sensor-association-dialog.html',
  styleUrls: ['sensor-association-dialog.css']
})
export class SensorAssociationDialog {
  associationForm: FormControl;
  constructor(
    public dialogRef: MatDialogRef<SensorAssociationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.data.isCanceled = true;
    this.data.mobility = 0;
    this.data.sensorSerial = '';
    this.associationForm = new FormControl('', [Validators.required, Validators.pattern('^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$')]);
  }

  choose(data){
    this.data.mobility = data.value;
  }

  btnClick(isCanceled: boolean) {
    this.data.isCanceled = isCanceled;
    this.data.sensorSerial = this.associationForm.value;
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}

export interface DialogData {
  sensorSerial: string;
  isCanceled: boolean;
  mobility: number;
}