import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { DisplayMessageService } from './display-message.service';
import { HEADER } from 'src/app/header';
import { MsgService } from './msg.service';
import { HttpClient } from '@angular/common/http';
import { timeout, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StateMachineManagementService } from './state-machine-management.service';

@Injectable({
  providedIn: 'root'
})
export class SignoutService {

  constructor(
    private storageService: StorageService,
    private msgService: MsgService,
    private dispMsgService: DisplayMessageService,
    private http: HttpClient,
    private router: Router,
    private stateService: StateMachineManagementService
  ) { }

  run() {
    var payload = {
      nsc: this.storageService.fnGetNumberOfSignedInCompletions()
    }

    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.SGO_NOT, Number(this.storageService.fnGetUserSequenceNumber()));
    this.dispMsgService.printLog(['SENT', 'MSG', 'SWP:SGO-NOT']);

    this.stateService.fnStateOfUsnTransitChange(HEADER.MSGTYPE.SGO_NOT, 0, 0, null);

    this.http.post(`/serverapi`, reqMsg)

      .pipe(timeout(HEADER.TIMER.T404),
        retry(HEADER.RETRIVE.R404))

      .subscribe((rspMsg: any) => {
        this.dispMsgService.printLog(['RCVD', 'MSG', 'SWP:SGO-ACK']);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.SGO_ACK, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER');
        }
        else {
          this.dispMsgService.printLog(['UNPK', 'PYLD', 'SWP:SGO-ACK', 'resultCode: '+rspMsg.payload.resultCode.toString()]);
          this.stateService.fnStateOfUsnTransitChange(0, HEADER.MSGTYPE.SGO_ACK, rspMsg.payload.resultCode, null);

          if (rspMsg.payload.resultCode == HEADER.RESCODE_SWP_SGO.OK) { // Succes
            this.dispMsgService.printLog(['UNPK', 'MSG', 'SWP:SGO-ACK', 'SUCCESS: Sign out']);
          }
          else {
            switch (rspMsg.payload.resultCode) {
              case (HEADER.RESCODE_SWP_SGO.OTHER): // warning-other
                this.dispMsgService.printLog(['UNPK', 'MSG', 'SWP:SGO-ACK', 'WARNING: Unknown warning']);
                break;
              case (HEADER.RESCODE_SWP_SGO.UNALLOCATED_USER_SEQUENCE_NUMBER): // warning-unallocated user sequence number
                this.dispMsgService.printLog(['UNPK', 'MSG', 'SWP:SGO-ACK', 'WARNING: Unallocated user sequence number']);
                break;
              case (HEADER.RESCODE_SWP_SGO.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS): // warning-incorrect number of signed-in completions
                this.dispMsgService.printLog(['UNPK', 'MSG', 'SWP:SGO-ACK', 'WARNING: Incorrect number of signed-in completions']);
                break;
            }
          }
        }
        HEADER.KAS_IN_INTERVAL = false;
        this.storageService.clear('all');
        this.dispMsgService.fnDispSuccessString('SIGNOUT', HEADER.NULL_VALUE);
        this.router.navigate([HEADER.ROUTER_PATHS.MAIN_PAGE]);

      }, (err) => {
        if (err.timeout) {
          this.dispMsgService.fnDispErrorString('CONNECTION_ERR');
          this.dispMsgService.printLog(['TMOT', 'CONN', 'ERR', JSON.stringify(err)]);
          this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T404');
        }
        else {
          this.dispMsgService.printLog(['ERR', 'OTHR', JSON.stringify(err)]);
        }
      });
  }
}
