import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout, retry } from 'rxjs/operators';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { HEADER } from 'src/app/header';
import { MsgService } from '../msg.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { DisplayMessageService } from 'src/app/services/display-message.service';
import { KasService } from '../kas.service';
import { StateMachineManagementService } from '../state-machine-management.service';


@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private msgService: MsgService,
    private authService: AuthorizationService,
    private kasService: KasService,
    private dispMsgService: DisplayMessageService,
    private stateService: StateMachineManagementService) { }


  /** fnSgu */
  fnSgu(payload: any) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.SGU_REQ, HEADER.NULL_VALUE);
    this.dispMsgService.printLog(['SENT', 'MSG', 'SWP:SGU-REQ']);

    this.stateService.fnStateOfUsnTransitChange(HEADER.MSGTYPE.SGU_REQ, 0, 0, null);

    this.http.post(`/serverapi`, reqMsg)

      .pipe(timeout(HEADER.TIMER.T401),
        retry(HEADER.RETRIVE.R401))

      .subscribe((rspMsg: any) => {
        this.dispMsgService.printLog(['RCVD', 'MSG', 'SWP:SGU-RSP']);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.SGU_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); return;
        }
        else {
          this.dispMsgService.printLog(['UNPK', 'PYLD', 'SWP:SGU-RSP', 'resultCode: '+rspMsg.payload.resultCode.toString()]);
          this.stateService.fnStateOfUsnTransitChange(0, HEADER.MSGTYPE.SGU_RSP, rspMsg.payload.resultCode, null);

          if (rspMsg.payload.resultCode == HEADER.RESCODE_SWP_SGU.OK) { // success
            this.dispMsgService.fnDispSuccessString('VERIFICATION_CODE_SENT', reqMsg.payload.userId);
            this.router.navigate([HEADER.ROUTER_PATHS.VERIFYING_UVC, rspMsg.header.endpointId, reqMsg.payload.userId, rspMsg.payload.vc], { skipLocationChange: true });
          }
          else {
            switch (rspMsg.payload.resultCode) {
              case (HEADER.RESCODE_SWP_SGU.OTHER): // reject-other
                this.dispMsgService.fnDispErrorString('OTHER');
                break;
              case (HEADER.RESCODE_SWP_SGU.CONFLICT_OF_TEMPORARY_CLIENT_ID): // reject-conflict of tci
                this.dispMsgService.fnDispErrorString('CONFLICT_OF_TEMPORARY_CLIENT_ID');
                break;
              case (HEADER.RESCODE_SWP_SGU.DUPLICATE_OF_USER_ID): // reject-duplicate of user ID
                this.dispMsgService.fnDispErrorString('DUPLICATE_OF_USER_ID');
                break;
            }
          }

        }
      }, (err) => {
        if (err.timeout) {
          this.dispMsgService.fnDispErrorString('CONNECTION_ERR');
          this.dispMsgService.printLog(['TMOT', 'CONN', 'ERR', JSON.stringify(err)]);
        }
        else {
          this.dispMsgService.printLog(['ERR', 'OTHR', JSON.stringify(err)]);
        }
        this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T401');
      });

  }

  /** fnUvc */
  fnUvc(payload: any, EP: number) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.UVC_REQ, EP);
    this.dispMsgService.printLog(['SENT', 'MSG', 'SWP:UVC-REQ']);

    this.stateService.fnStateOfUsnTransitChange(HEADER.MSGTYPE.UVC_REQ, 0, 0, null);

    this.http.post(`/serverapi`, reqMsg)

      .pipe(timeout(HEADER.TIMER.T402),
        retry(HEADER.RETRIVE.R402))

      .subscribe((rspMsg: any) => {
        this.dispMsgService.printLog(['RCVD', 'MSG', 'SWP:UVC-RSP']);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.UVC_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); return;
        }
        else {
          this.dispMsgService.printLog(['UNPK', 'PYLD', 'SWP:UVC-RSP', 'resultCode: '+rspMsg.payload.resultCode.toString()]);
          this.stateService.fnStateOfUsnTransitChange(0, HEADER.MSGTYPE.UVC_RSP, rspMsg.payload.resultCode, null);

          if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_UVC.OK){
            this.dispMsgService.fnDispSuccessString('SIGNUP_COMPLETED', HEADER.NULL_VALUE);
            this.router.navigate([HEADER.ROUTER_PATHS.SIGN_IN]);
          }
          else {
            switch (rspMsg.payload.resultCode) {
              case (HEADER.RESCODE_SWP_UVC.OTHER): // reject-other
                this.dispMsgService.fnDispErrorString('OTHER');
                break;
              case (HEADER.RESCODE_SWP_UVC.DUPLICATE_OF_USER_ID): // reject-duplicate of user ID
                this.dispMsgService.fnDispErrorString('DUPLICATE_OF_USER_ID');
                break;
              case (HEADER.RESCODE_SWP_UVC.NOT_EXIST_TEMPORARY_CLIENT_ID): // reject-not exist Temporary Client ID
                this.dispMsgService.fnDispErrorString('NOT_EXIST_TEMPORARY_CLIENT_ID');
                break;
              case (HEADER.RESCODE_SWP_UVC.INCORRECT_AUTHENTICATION_CODE): // reject-incorrect authentication code under the verification code
                this.dispMsgService.fnDispErrorString('INCORRECT_AUTHENTICATION_CODE');
                break;
            }
          }

        }        
      }, (err) => {
        if (err.timeout) {
          this.dispMsgService.fnDispErrorString('CONNECTION_ERR');
          this.dispMsgService.printLog(['TMOT', 'CONN', 'ERR', JSON.stringify(err)]);
        }
        else {
          this.dispMsgService.printLog(['ERR', 'OTHR', JSON.stringify(err)]);
        }
        this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T402')
      });
  }

  /** fnSgi */
  fnSgi(payload: any) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.SGI_REQ, HEADER.NULL_VALUE);
    this.dispMsgService.printLog(['SENT', 'MSG', 'SWP:SGI-REQ']);

    this.stateService.fnStateOfUsnTransitChange(HEADER.MSGTYPE.SGI_REQ, 0, 0, null);

    this.http.post(`/serverapi`, reqMsg)

      .pipe(timeout(HEADER.TIMER.T403),
        retry(HEADER.RETRIVE.R403))

      .subscribe((rspMsg: any) => {
        this.dispMsgService.printLog(['RCVD', 'MSG', 'SWP:SGI-RSP']);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.SGI_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER');
        }
        else {
          this.dispMsgService.printLog(['UNPK', 'PYLD', 'SWP:SGI-RSP', 'resultCode: '+rspMsg.payload.resultCode.toString()]);
          this.stateService.fnStateOfUsnTransitChange(0, HEADER.MSGTYPE.SGI_RSP, rspMsg.payload.resultCode, null);

          if (rspMsg.payload.resultCode == HEADER.RESCODE_SWP_SGI.OK) { // success
            var userInfo = { usn: rspMsg.payload.usn, nsc: rspMsg.payload.nsc, email: reqMsg.payload.userID };
            this.storageService.set('userInfo', userInfo);
            this.dispMsgService.fnDispSuccessString('SIGNIN_COMPLETED', HEADER.NULL_VALUE);
  
            if (this.authService.isAdministor(Number(rspMsg.payload.usn)))
              this.router.navigate([HEADER.ROUTER_PATHS.ADMIN_DASHBOARD]);
            else this.router.navigate([HEADER.ROUTER_PATHS.COMMON_USER_DASHBOARD]);
  
            this.kasService.startTimer();
          }
          else {
            switch (rspMsg.payload.resultCode) {
              case (HEADER.RESCODE_SWP_SGI.OTHER): // reject-other
                this.dispMsgService.fnDispErrorString('OTHER');
                break;
              case (HEADER.RESCODE_SWP_SGI.CONFLICT_OF_TEMPORARY_CLIENT_ID): // reject-conflict of Temporary Client ID
                this.dispMsgService.fnDispErrorString('CONFLICT_OF_TEMPORARY_CLIENT_ID');
                break;
              case (HEADER.RESCODE_SWP_SGI.NOT_EXIST_USER_ID): // reject-not exist user ID
                this.dispMsgService.fnDispErrorString('NOT_EXIST_USER_ID');
                break;
              case (HEADER.RESCODE_SWP_SGI.INCORRECT_CURRENT_USER_PASSWORD): // reject-incorrect current user password
                this.dispMsgService.fnDispErrorString('INCORRECT_CURRENT_USER_PASSWORD');
                break;
            }
          }

        }
      }, (err) => {
        if (err.timeout) {
          this.dispMsgService.fnDispErrorString('CONNECTION_ERR');
          this.dispMsgService.printLog(['TMOT', 'CONN', 'ERR', JSON.stringify(err)]);
        }
        else {
          this.dispMsgService.printLog(['ERR', 'OTHR', JSON.stringify(err)]);
        }
        this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T403');
      });
  }

  /** fnUpc */
  fnUpc(payload: any) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.UPC_REQ, Number(this.storageService.fnGetUserSequenceNumber()));
    this.dispMsgService.printLog(['SENT', 'MSG', 'SWP:UPC-REQ']);

    this.stateService.fnStateOfUsnTransitChange(HEADER.MSGTYPE.UPC_REQ, 0, 0, null);

    this.http.post(`/serverapi`, reqMsg)

      .pipe(timeout(HEADER.TIMER.T405),
        retry(HEADER.RETRIVE.R405))
      .subscribe((rspMsg: any) => {
        this.dispMsgService.printLog(['RCVD', 'MSG', 'SWP:UPC-RSP']);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.UPC_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); return;
        }
        else {
          this.dispMsgService.printLog(['UNPK', 'PYLD', 'SWP:UPC-RSP', 'resultCode: '+rspMsg.payload.resultCode.toString()]);
          this.stateService.fnStateOfUsnTransitChange(0, HEADER.MSGTYPE.UPC_RSP, rspMsg.payload.resultCode, null);

          if (rspMsg.payload.resultCode == HEADER.RESCODE_SWP_UPC.OK) { // success
            this.dispMsgService.fnDispSuccessString('PWCHANGE_COMPLETED', HEADER.NULL_VALUE);
          }
          else {
            switch (rspMsg.payload.resultCode) {
              case (HEADER.RESCODE_SWP_UPC.OTHER): // reject-other
                this.dispMsgService.fnDispErrorString('OTHER');
                break;
              case (HEADER.RESCODE_SWP_UPC.UNALLOCATED_USER_SEQUENCE_NUMBER): // reject-unallocated user sequence number
                this.dispMsgService.fnDispErrorString('UNALLOCATED_USER_SEQUENCE_NUMBER');
                break;
              case (HEADER.RESCODE_SWP_UPC.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS): // reject-incorrect number of signed-in completions
                this.dispMsgService.fnDispErrorString('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS');
                break;
              case (HEADER.RESCODE_SWP_UPC.INCORRECT_CURRENT_USER_PASSWORD): // reject-incorrect current user password
                this.dispMsgService.fnDispErrorString('INCORRECT_CURRENT_USER_PASSWORD');
                break;
            }
          }

        }
      }, (err) => {
        if (err.timeout) {
          this.dispMsgService.fnDispErrorString('CONNECTION_ERR');
          this.dispMsgService.printLog(['TMOT', 'CONN', 'ERR', JSON.stringify(err)]);
        }
        else {
          this.dispMsgService.printLog(['ERR', 'OTHR', JSON.stringify(err)]);
        }
        this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T405');
      });
  }

  /** fnFpu */
  fnFpu(payload: any) {

    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.FPU_REQ, HEADER.NULL_VALUE);
    this.dispMsgService.printLog(['SENT', 'MSG', 'SWP:FPU-REQ']);

    this.stateService.fnStateOfUsnTransitChange(HEADER.MSGTYPE.FPU_REQ, 0, 0, null);

    this.http.post(`/serverapi`, reqMsg)

      .pipe(timeout(HEADER.TIMER.T406),
        retry(HEADER.RETRIVE.R406))

      .subscribe((rspMsg: any) => {
        this.dispMsgService.printLog(['RCVD', 'MSG', 'SWP:FPU-RSP']);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.FPU_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); return;
        }
        else {
          this.dispMsgService.printLog(['UNPK', 'PYLD', 'SWP:FPU-RSP', 'resultCode: '+rspMsg.payload.resultCode.toString()]);
          this.stateService.fnStateOfUsnTransitChange(0, HEADER.MSGTYPE.FPU_RSP, rspMsg.payload.resultCode, null);

          if (rspMsg.payload.resultCode == HEADER.RESCODE_SWP_FPU.OK) { // success
            this.dispMsgService.fnDispSuccessString('FPU_COMPLETED', null);
            this.router.navigate([HEADER.ROUTER_PATHS.SIGN_IN]);
          }
          else {
            switch (rspMsg.payload.resultCode) {
              case (HEADER.RESCODE_SWP_FPU.OTHER): // reject-other
                this.dispMsgService.fnDispErrorString('OTHER');
                break;
              case (HEADER.RESCODE_SWP_FPU.CONFLICT_OF_TEMPORARY_CLIENT_ID): // reject-conflict of tci
                this.dispMsgService.fnDispErrorString('CONFLICT_OF_TEMPORARY_CLIENT_ID');
                break;
              case (HEADER.RESCODE_SWP_FPU.INCORRECT_USER_INFORMATION): // reject-incorrect user information
                this.dispMsgService.fnDispErrorString('INCORRECT_USER_INFORMATION');
                break;
              case (HEADER.RESCODE_SWP_FPU.NOT_EXIST_USER_ID): // reject-not exist user ID
                this.dispMsgService.fnDispErrorString('NOT_EXIST_USER_ID');
                break;
            }
          }

        }
      }, (err) => {
        if (err.timeout) {
          this.dispMsgService.fnDispErrorString('CONNECTION_ERR');
          this.dispMsgService.printLog(['TMOT', 'CONN', 'ERR', JSON.stringify(err)]);
        }
        else {
          this.dispMsgService.printLog(['ERR', 'OTHR', JSON.stringify(err)]);
        }
        this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T406');
      });
  }

  /** fnUdr */
  fnUdr(payload: any) {

    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.UDR_REQ, this.storageService.fnGetUserSequenceNumber());
    this.dispMsgService.printLog(['SENT', 'MSG', 'SWP:UDR-REQ']);

    this.stateService.fnStateOfUsnTransitChange(HEADER.MSGTYPE.UDR_REQ, 0, 0, null);

    this.http.post(`/serverapi`, reqMsg)

      .pipe(timeout(HEADER.TIMER.T407),
        retry(HEADER.RETRIVE.R407))

      .subscribe((rspMsg: any) => {
        this.dispMsgService.printLog(['RCVD', 'MSG', 'SWP:UDR-RSP']);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.UDR_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); return;
        }
        else {
          this.dispMsgService.printLog(['UNPK', 'PYLD', 'SWP:UDR-RSP', 'resultCode: '+rspMsg.payload.resultCode.toString()]);
          this.stateService.fnStateOfUsnTransitChange(0, HEADER.MSGTYPE.UDR_RSP, rspMsg.payload.resultCode, null);

          if (rspMsg.payload.resultCode == HEADER.RESCODE_SWP_UDR.OK) { // success
            this.dispMsgService.fnDispSuccessString('UDR_COMPLETED', HEADER.NULL_VALUE);
            this.storageService.clear('all');
            this.router.navigate([HEADER.ROUTER_PATHS.MAIN_PAGE]);
          }
          else {
            switch (rspMsg.payload.resultCode) {
              case (HEADER.RESCODE_SWP_UDR.OTHER): // reject-other
                this.dispMsgService.fnDispErrorString('OTHER');
                break;
              case (HEADER.RESCODE_SWP_UDR.UNALLOCATED_USER_SEQUENCE_NUMBER): // reject-unallocated user sequence number
                this.dispMsgService.fnDispErrorString('UNALLOCATED_USER_SEQUENCE_NUMBER');
                break;
              case (HEADER.RESCODE_SWP_UDR.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS): // reject-incorrect number of signed-in completions
                this.dispMsgService.fnDispErrorString('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS');
                break;
              case (HEADER.RESCODE_SWP_UDR.INCORRECT_CURRENT_USER_PASSWORD): // reject-incorrect current user password
                this.dispMsgService.fnDispErrorString('INCORRECT_CURRENT_USER_PASSWORD');
                break;
            }
          }

        }
      }, (err) => {
        if (err.timeout) {
          this.dispMsgService.fnDispErrorString('CONNECTION_ERR');
          this.dispMsgService.printLog(['TMOT', 'CONN', 'ERR', JSON.stringify(err)]);
        }
        else {
          this.dispMsgService.printLog(['ERR', 'OTHR', JSON.stringify(err)]);
        }
        this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T407');
      });

    return HEADER.RES_SUCCESS;
  }

  /** fnAuv */
  fnAuv(payload: any, cb) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.AUV_REQ, this.storageService.fnGetUserSequenceNumber());
    this.dispMsgService.printLog(['SENT', 'MSG', 'SWP:AUV-REQ']);

    this.stateService.fnStateOfUsnTransitChange(HEADER.MSGTYPE.AUV_REQ, 0, 0, null);

    this.http.post(`/serverapi`, reqMsg)

      .pipe(timeout(HEADER.TIMER.T408),
        retry(HEADER.RETRIVE.R408))

      .subscribe((rspMsg: any) => {
        this.dispMsgService.printLog(['RCVD', 'MSG', 'SWP:AUV-RSP']);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.AUV_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER');
          cb(HEADER.NULL_VALUE); return;
        }
        else {
          this.dispMsgService.printLog(['UNPK', 'PYLD', 'SWP:AUV-RSP', 'resultCode: '+rspMsg.payload.resultCode.toString()]);
          this.stateService.fnStateOfUsnTransitChange(0, HEADER.MSGTYPE.AUV_RSP, rspMsg.payload.resultCode, null);

          if (rspMsg.payload.resultCode == HEADER.RESCODE_SWP_AUV.OK) { // success
            cb(rspMsg);
          }
          else {
            switch (rspMsg.payload.resultCode) {
              case (HEADER.RESCODE_SWP_AUV.OTHER): // reject-other
                this.dispMsgService.fnDispErrorString('OTHER');
                break;
              case (HEADER.RESCODE_SWP_AUV.UNALLOCATED_USER_SEQUENCE_NUMBER): // reject-unallocated user sequence number
                this.dispMsgService.fnDispErrorString('UNALLOCATED_USER_SEQUENCE_NUMBER');
                break;
              case (HEADER.RESCODE_SWP_AUV.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS): // reject-incorrect number of signed-in completions
                this.dispMsgService.fnDispErrorString('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS');
                break;
              case (HEADER.RESCODE_SWP_AUV.UNAUTHORIZED_USER_SEQUENCE_NUMBER): // reject-unauthorized user sequence number
                this.dispMsgService.fnDispErrorString('UNAUTHORIZED_USER_SEQUENCE_NUMBER');
                break;
            }
            cb(HEADER.NULL_VALUE);
          }

        }
      }, (err) => {
        if (err.timeout) {
          this.dispMsgService.fnDispErrorString('CONNECTION_ERR');
          this.dispMsgService.printLog(['TMOT', 'CONN', 'ERR', JSON.stringify(err)]);
        }
        else {
          this.dispMsgService.printLog(['ERR', 'OTHR', JSON.stringify(err)]);
        }
        this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T408');
      });
  }
}
