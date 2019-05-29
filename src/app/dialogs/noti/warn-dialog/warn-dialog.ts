/** warn-dialog */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: 'warn-dialog.html',
  styleUrls: ['warn-dialog.css']
})
export class WarnDialog {
  constructor(
    public dialogRef: MatDialogRef<WarnDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}

export interface DialogData {
  warnContents: string;
}