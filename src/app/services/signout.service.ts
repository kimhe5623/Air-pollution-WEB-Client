import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { DisplayMessageService } from './display-message.service';
import { HEADER } from 'src/app/header';
import { MsgService } from './msg.service';
import { HttpClient } from '@angular/common/http';
import { timeout, retry } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SignoutService {

  constructor(
    private storageService: StorageService,
    private msgService: MsgService,
    private dispMsgService: DisplayMessageService,
    private http: HttpClient,
    private router: Router
  ) { }

  run() {
    var payload = {
      nsc: this.storageService.fnGetNumberOfSignedInCompletions()
    }

    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.SGO_NOT, Number(this.storageService.fnGetUserSequenceNumber()));
    console.log("HTTP:SGO-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)

      .pipe(timeout(HEADER.TIMER.T404),
        retry(HEADER.RETRIVE.R404))

      .subscribe((rspMsg: any) => {
        console.log("HTTP:SGO-RSP => ", rspMsg);
        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.SGO_RSP, reqMsg.header.endpointId)) {
          console.log('INCORRECT_HEADER'); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            // OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3,

            case (HEADER.RESCODE_SWP_SGO.OK): // success
              console.log('SUCCESS: Sign out');
              break;

            case (HEADER.RESCODE_SWP_SGO.OTHER): // warning-other
              console.log("WARNING: Unknown warning");
              break;

            case (HEADER.RESCODE_SWP_SGO.UNALLOCATED_USER_SEQUENCE_NUMBER): // warning-unallocated user sequence number
              console.log("WARNING: Unallocated user sequence number");
              break;

            case (HEADER.RESCODE_SWP_SGO.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS): // warning-incorrect number of signed-in completions
              console.log("WARNING: Incorrect number of signed-in completions");
              break;
          }
        }

      }, (err) => {
        if (err.timeout) {
          console.log('In timeout error which is -> ', err);
        }
        else {
          console.log('Error which is -> ', err);
        }
      });
      
      HEADER.KAS_IN_INTERVAL = false;
      this.storageService.clear('all');
      this.dispMsgService.fnDispSuccessString('SIGNOUT', HEADER.NULL_VALUE);
      this.router.navigate([HEADER.ROUTER_PATHS.MAIN_PAGE]);
  }
}
