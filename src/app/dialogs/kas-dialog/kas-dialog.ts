/** kas-dialog */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: 'kas-dialog.html',
  styleUrls: ['kas-dialog.css']
})
export class KasDialog {
    constructor(
        public dialogRef: MatDialogRef<KasDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this.data.isCanceled = true;
      }

    btnClick(){
        this.data.isCanceled = true;
    }
}

export interface DialogData {
    isCanceled: boolean;
  }