import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { InfoDialog } from '../dialogs/noti/info-dialog/info-dialog';
import { SuccDialog } from '../dialogs/noti/succ-dialog/succ-dialog';
import { ErrDialog } from '../dialogs/noti/err-dialog/err-dialog';
import { WarnDialog } from '../dialogs/noti/warn-dialog/warn-dialog';
import { HEADER } from 'src/app/header';

@Injectable({
  providedIn: 'root'
})
export class NotiService {
  width: number = 650;
  height: number = 110;
  closeTimer: number = 3000;
  dialogRefs: any = [];

  constructor(
    private dialog: MatDialog,
  ) { }

  info(contents: string, width?: number) {
    const infoDialogRef = this.dialog.open(InfoDialog, {
      width: `${width != null ? width : this.width}px`, height: `${this.height}px`,
      data: { infoContents: contents },
      position: {
        top: `${10 + HEADER.numOfNoti * (10 + this.height)}px`,
        right: '10px'
      },
      disableClose: true,
      closeOnNavigation: true,
      hasBackdrop: false,
      panelClass: 'noti'
    });

    this.dialogRefs.push(infoDialogRef);
    HEADER.numOfNoti++;

    var infoClose = function() {
      infoDialogRef.close();
    }
    setTimeout(infoClose, this.closeTimer);
    
    infoDialogRef.afterClosed().subscribe(result => {
      this.dialogRefs.shift();
      HEADER.numOfNoti = HEADER.numOfNoti - 1;

      for(var i=0; i<this.dialogRefs.length; i++) {
        this.dialogRefs[i].updatePosition({
          top: `${10 + i * (10 + this.height)}px`,
          right: '10px'
        })
      }
    });
  }

  succ(contents: string, width?: number) {
    const succDialogRef = this.dialog.open(SuccDialog, {
      width: `${width != null ? width : this.width}px`, height: `${this.height}px`,
      data: { succContents: contents },
      position: {
        top: `${10 + HEADER.numOfNoti * (10 + this.height)}px`,
        right: '10px'
      },
      disableClose: true,
      closeOnNavigation: true,
      hasBackdrop: false,
      panelClass: 'noti'
    });

    this.dialogRefs.push(succDialogRef);
    HEADER.numOfNoti++;

    var succClose = function() {
      succDialogRef.close();
    }
    setTimeout(succClose, this.closeTimer);
    
    succDialogRef.afterClosed().subscribe(result => {
      this.dialogRefs.shift();
      HEADER.numOfNoti = HEADER.numOfNoti - 1;

      for(var i=0; i<this.dialogRefs.length; i++) {
        this.dialogRefs[i].updatePosition({
          top: `${10 + i * (10 + this.height)}px`,
          right: '10px'
        })
      }
    });
  }

  err(contents: string, width?: number) {
    const errDialogRef = this.dialog.open(ErrDialog, {
      width: `${width != null ? width : this.width}px`, height: `${this.height}px`,
      data: { errContents: contents },
      position: {
        top: `${10 + HEADER.numOfNoti * (10 + this.height)}px`,
        right: '10px'
      },
      disableClose: true,
      closeOnNavigation: true,
      hasBackdrop: false,
      panelClass: 'noti'
    });

    this.dialogRefs.push(errDialogRef);
    HEADER.numOfNoti++;

    var errClose = function() {
      errDialogRef.close();
    }
    setTimeout(errClose, this.closeTimer);
    
    errDialogRef.afterClosed().subscribe(result => {
      this.dialogRefs.shift();
      HEADER.numOfNoti = HEADER.numOfNoti - 1;

      for(var i=0; i<this.dialogRefs.length; i++) {
        this.dialogRefs[i].updatePosition({
          top: `${10 + i * (10 + this.height)}px`,
          right: '10px'
        })
      }
    });
  }

  warn(contents: string, width?: number) {
    const warnDialogRef = this.dialog.open(WarnDialog, {
      width: `${width != null ? width : this.width}px`, height: `${this.height}px`,
      data: { warnContents: contents },
      position: {
        top: `${10 + HEADER.numOfNoti * (10 + this.height)}px`,
        right: '10px'
      },
      disableClose: true,
      closeOnNavigation: true,
      hasBackdrop: false,
      panelClass: 'noti'
    });

    this.dialogRefs.push(warnDialogRef);
    HEADER.numOfNoti++;

    var warnClose = function() {
      warnDialogRef.close();
    }
    setTimeout(warnClose, this.closeTimer);
    
    warnDialogRef.afterClosed().subscribe(result => {
      this.dialogRefs.shift();
      HEADER.numOfNoti = HEADER.numOfNoti - 1;

      for(var i=0; i<this.dialogRefs.length; i++) {
        this.dialogRefs[i].updatePosition({
          top: `${10 + i * (10 + this.height)}px`,
          right: '10px'
        })
      }
    });
  }

}
