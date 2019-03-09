/** Sensor-association-dialog */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DataManagementService } from 'src/app/services/data-management.service';

@Component({
  templateUrl: './shr-to-hav-dialog.component.html',
  styleUrls: ['./shr-to-hav-dialog.component.css']
})
export class ShrToHavDialog {

  startDateForm: FormControl;
  endDateForm: FormControl;

  timeSet: any = { hour: [], min: [] };

  enteredStartHour: number;
  enteredStartMin: number;
  enteredStartMode: number; // 0 or 12
  enteredEndHour: number;
  enteredEndMin: number;
  enteredEndMode: number; // 0 or 12
  isIncorrectTimeSelection: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ShrToHavDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dataService: DataManagementService
  ) {
    this.startDateForm = new FormControl(new Date(), [Validators.required]);
    this.endDateForm = new FormControl(new Date(), [Validators.required]);

    /** Time selection values set */
    this.timeSet.hour.push(12);
    for (var i = 0; i < 11; i++) {
      this.timeSet.hour.push(i + 1);
      this.timeSet.min.push(i + 1);
    }
    for (var i = 11; i < 59; i++) {
      this.timeSet.min.push(i + 1);
    }
    this.timeSet.min.push(0);

    this.enteredStartHour = 12;
    this.enteredStartMin = 0;
    this.enteredStartMode = 0; // 0 or 12
    this.enteredEndHour = 11;
    this.enteredEndMin = 59;
    this.enteredEndMode = 12; // 0 or 12
  }

  timeSelectChanged() {
    if (this.startDateForm.value == this.endDateForm.value) {
      var startHour = this.enteredStartHour + this.enteredStartMode;
      var endHour = this.enteredEndHour + this.enteredEndMode;

      if (startHour > endHour) {
        this.isIncorrectTimeSelection = true;
      }
      else if (startHour == endHour) {
        if (this.enteredStartMin < this.enteredEndMin) {
          this.isIncorrectTimeSelection = true;
        }
      }
      else {
        this.isIncorrectTimeSelection = false;
      }
    }
  }

  



  fnBtnClick(isCanceled: boolean) {
    this.data.isCanceled = isCanceled;
    this.data.startTmsp = Math.floor(new Date(this.startDateForm.value).setHours(this.dataService.hourCalcTo24(this.enteredStartHour, this.enteredStartMode), this.enteredStartMin) / 1000);
    this.data.endTmsp = Math.floor(new Date(this.endDateForm.value).setHours(this.dataService.hourCalcTo24(this.enteredEndHour, this.enteredEndMode), this.enteredEndMin) / 1000);
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

}

export interface DialogData {
  startTmsp: number;
  endTmsp: number;
  isCanceled: boolean;
}