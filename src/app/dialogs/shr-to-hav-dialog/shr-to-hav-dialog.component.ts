/** Sensor-association-dialog */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HEADER } from 'src/app/header';
import { FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: './shr-to-hav-dialog.component.html',
  styleUrls: ['./shr-to-hav-dialog.component.css']
})
export class ShrToHavDialog {

  startDateForm: FormControl;
  endDateForm: FormControl;

  constructor(
    public dialogRef: MatDialogRef<ShrToHavDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.startDateForm = new FormControl(new Date().toISOString(), [Validators.required]);
    this.endDateForm = new FormControl(new Date().toISOString(), [Validators.required]);
  }


  fnBtnClick(isCanceled: boolean) {
    this.data.isCanceled = isCanceled;
    this.data.startDate = this.startDateForm.value;
    this.data.endDate = this.endDateForm.value;
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

}

export interface DialogData {
  startDate: Date;
  endDate: Date;
  isCanceled: boolean;
}