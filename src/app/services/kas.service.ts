import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { KasDialog } from 'src/app/dialogs/kas-dialog/kas-dialog';
import { StorageService } from './storage.service';
import { DataMonitoringService } from './httpRequest/data-monitoring.service';
import { HEADER } from 'src/app/header';
import { SignoutService } from './signout.service';
import { StateMachineManagementService } from './state-machine-management.service';


@Injectable({
  providedIn: 'root'
})
export class KasService {

  constructor(
    private dmService: DataMonitoringService,
    private signoutService: SignoutService,
    private storageService: StorageService,
    private dialog: MatDialog,
    private stateService: StateMachineManagementService
  ) { }

  private interval: any;
  private inInterval: boolean = false;
  private val: number;

  private dialogOpen: boolean = false;

  init() {
    this.dialogOpen = false;

    if(this.storageService.get('userInfo')){
      this.val = Number(this.storageService.get('kas_val'));
      this.inInterval = true;
    }

    this.interval = setInterval(() => {

      if (this.inInterval) {

        this.val++;
        this.storageService.set('kas_val', this.val);
        
        //console.log("KAS service => ", this.val, ' sec');

        if (this.val >= HEADER.TIMER.T552/1000 - 180) { // 180 == 60 * 3  => 3 minutes 
 
          if (!this.dialogOpen) {
            this.openKasDialog();
            this.dialogOpen = true;
          }

          if (this.val >= 20) { // When timeout,
            clearInterval(this.interval);
            this.val = 0;
            this.storageService.set('kas_val', this.val);
            this.inInterval = false;

            this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T552');
            this.dialog.closeAll();
          }

          this.signoutService.run();
        }
      }
    }, 1000);

  }

  /**
   * Start Timer
   */
  startTimer() {
    this.inInterval = true;
    this.dialogOpen = false;
    this.val = 0;
    this.storageService.set('kas_val', this.val);
  }

  //------(Dialog functions)--------
  openKasDialog(): void {
    const dialogRef = this.dialog.open(KasDialog, {
      width: 'auto', height: 'auto',
      data: { isCanceled: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpen = false;

      //console.log("kasDialog result => ", result);
      if (result != null && !result.isCanceled) { // When the user does action,

        var payload = {
          nsc: this.storageService.fnGetNumberOfSignedInCompletions()
        }

        this.dmService.fnKas(payload, (success) => {
          if (!success) {
            alert('Failed!');
          }
          else {  // restart timer
            //clearInterval(this.interval);
            this.startTimer();
          }
        });
      }
    });
  }
}
