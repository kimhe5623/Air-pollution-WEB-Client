/** succ-dialog */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: 'succ-dialog.html',
  styleUrls: ['succ-dialog.css']
})
export class SuccDialog {
  constructor(
    public dialogRef: MatDialogRef<SuccDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}

export interface DialogData {
  succContents: string;
}