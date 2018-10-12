/** Sensor-association-dialog */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: 'user-deregistration-confirm-dialog.html',
  styleUrls: ['user-deregistration-confirm-dialog.css']
})
export class UserDeregistrationConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<UserDeregistrationConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.data.isCanceled = true;
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
}