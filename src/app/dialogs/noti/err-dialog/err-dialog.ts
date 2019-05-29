/** err-dialog */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: 'err-dialog.html',
  styleUrls: ['err-dialog.css']
})
export class ErrDialog {
  constructor(
    public dialogRef: MatDialogRef<ErrDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}

export interface DialogData {
  errContents: string;
}