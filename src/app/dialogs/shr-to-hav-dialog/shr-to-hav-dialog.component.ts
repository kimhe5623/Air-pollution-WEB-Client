/** Sensor-association-dialog */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
    this.startDateForm = new FormControl(this.data.startDate, [Validators.required]);
    this.endDateForm = new FormControl(this.data.endDate, [Validators.required]);
  }


  fnBtnClick(isCanceled: boolean) {
    this.data.isCanceled = isCanceled;
    this.data.startDate = this.startDateForm.value;
    this.data.endDate = new Date(new Date(this.endDateForm.value).setHours(23,59,59,99));
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