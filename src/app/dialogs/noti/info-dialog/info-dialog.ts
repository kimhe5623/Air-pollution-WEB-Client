/** info-dialog */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: 'info-dialog.html',
  styleUrls: ['info-dialog.css']
})
export class InfoDialog {
    constructor(
        public dialogRef: MatDialogRef<InfoDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}

export interface DialogData {
    infoContents: string;
  }