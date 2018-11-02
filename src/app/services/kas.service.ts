import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { KasDialog } from 'src/app/dialogs/kas-dialog/kas-dialog';
import { StorageService } from './storage.service';
import { DataMonitoringService } from './httpRequest/data-monitoring.service';
import { timer } from 'rxjs/observable/timer';
import { TIMER } from 'src/app/header';


@Injectable({
  providedIn: 'root'
})
export class KasService {

  constructor(
    private dmService: DataMonitoringService,
    private storageService: StorageService,
    private dialog: MatDialog,
  ) { }

  /**
   * Start Timer
   */
  startTimer() {
    /*
          timer takes a second argument, how often to emit subsequent values
          in this case we will emit first value after 1 second and subsequent
          values every 2 seconds after
        */
    const source = timer(1, 1000);
    //output: 1,2,3,4,5......
    const subscribe = source.subscribe(val => {
      if(val % 10) console.log("KAS service => ", val, ' sec');
      if(val == TIMER.T551) {
        this.openKasDialog();
      }
    });
  }
  //------(Dialog functions)--------
  openKasDialog(): void {
    const dialogRef = this.dialog.open(KasDialog, {
      width: 'auto', height: 'auto',
      data: { isCanceled: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && !result.isCanceled) {
        var payload = {
          nsc: this.storageService.get('userInfo').nsc
        }

        this.dmService.KAS(payload, (success) => {
          if (!success) {
            alert('Failed!');
          }
        });
      }
    });
  }
}
