import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { KasDialog } from 'src/app/dialogs/kas-dialog/kas-dialog';
import { StorageService } from './storage.service';
import { DataMonitoringService } from './httpRequest/data-monitoring.service';


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
  startTimer(){

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
