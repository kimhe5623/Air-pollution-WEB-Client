/** Sensor-association-dialog */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { HEADER } from 'src/app/header';

@Component({
  templateUrl: 'sensor-association-dialog.html',
  styleUrls: ['sensor-association-dialog.css']
})
export class SensorAssociationDialog {
  associationForm: FormControl;
  constructor(
    public dialogRef: MatDialogRef<SensorAssociationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.data.isCanceled = HEADER.RES_SUCCESS;
    this.data.mobility = 0;
    this.data.sensorSerial = '';
    this.associationForm = new FormControl('', [Validators.required, Validators.pattern('^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$')]);
  }

  fnChoose(data){
    this.data.mobility = data.value;
  }

  fnBtnClick(isCanceled: boolean) {
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