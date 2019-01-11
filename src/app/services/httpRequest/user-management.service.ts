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
    private dispMsgService: DisplayMessageService) { }


  /** fnSgu */
  fnSgu(payload: any) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.SGU_REQ, HEADER.NULL_VALUE);
    console.log("HTTP:SGU-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)

      // .pipe(timeout(HEADER.TIMER.T401),
      //   retry(HEADER.RETRIVE.R401))

      .subscribe((rspMsg: any) => {
        console.log("HTTP:SGU-RSP => ", rspMsg);
        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.SGU_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); return;
        }

        else if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_SGU.OK) { // success
          this.dispMsgService.fnDispSuccessString('VERIFICATION_CODE_SENDED', reqMsg.payload.userId);
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
      }, (err) => {
        if (err.timeout) {
          console.log('In timeout error which is -> ', err);
        }
        else {
          console.log('Error which is -> ', err);
        }
      });

  }

  /** fnUvc */
  fnUvc(payload: any, EP: number) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.UVC_REQ, EP);
    console.log("HTTP:UVC-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)

      // .pipe(timeout(HEADER.TIMER.T402),
      //   retry(HEADER.RETRIVE.R402))

      .subscribe((rspMsg: any) => {
        console.log("HTTP:UVC-RSP => ", rspMsg);
        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.UVC_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            // OK: 0, OTHER: 1, DUPLICATE_OF_USER_ID: 2, NOT_EXIST_TEMPORARY_CLIENT_ID: 3, INCORRECT_AUTHENTICATION_CODE: 4,

            case (HEADER.RESCODE_SWP_UVC.OK): // success
              this.dispMsgService.fnDispSuccessString('SIGNUP_COMPLETED', HEADER.NULL_VALUE);
              this.router.navigate([HEADER.ROUTER_PATHS.SIGN_IN]);
              break;

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
      }, (err) => {
        if (err.timeout) {
          console.log('In timeout error which is -> ', err);
        }
        else {
          console.log('Error which is -> ', err);
        }
      });
  }

  /** fnSgi */
  fnSgi(payload: any) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.SGI_REQ, HEADER.NULL_VALUE);
    console.log("HTTP:SGI-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)

      // .pipe(timeout(HEADER.TIMER.T403))
      //   retry(HEADER.RETRIVE.R403))

      .subscribe((rspMsg: any) => {
        console.log("HTTP:SGI-RSP => ", rspMsg);
        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.SGI_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); return;
        }

        else if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_SGI.OK) { // success
          var userInfo = { usn: rspMsg.payload.usn, nsc: rspMsg.payload.nsc, email: reqMsg.payload.userID };
          this.storageService.set('userInfo', userInfo);
          this.dispMsgService.fnDispSuccessString('SIGNIN_COMPLETED', HEADER.NULL_VALUE);

          // Rendering
          if (this.authService.isAdministor(Number(rspMsg.payload.usn))) {
            this.router.navigate([HEADER.ROUTER_PATHS.ADMIN_DASHBOARD]);
          }
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
      }, (err) => {
        if (err.timeout) {
          console.log('In timeout error which is -> ', err);
        }
        else {
          console.log('Error which is -> ', err);
        }
      });
  }

  /** fnSgo */
  fnSgo(payload: any) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.SGO_NOT, Number(this.storageService.fnGetUserSequenceNumber()));
    console.log("HTTP:SGO-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)

      // .pipe(timeout(HEADER.TIMER.T404),
      //   retry(HEADER.RETRIVE.R404))

      .subscribe((rspMsg: any) => {
        console.log("HTTP:SGO-RSP => ", rspMsg);
        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.SGO_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); return;
        }

        else if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_SGO.OK) { // success
          console.log('SUCCESS: Sign out');
        }

        else {
          switch (rspMsg.payload.resultCode) {

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

    this.storageService.clear('all');
    this.dispMsgService.fnDispSuccessString('SIGNOUT', HEADER.NULL_VALUE);
    this.router.navigate([HEADER.ROUTER_PATHS.MAIN_PAGE]);
  }

  /** fnUpc */
  fnUpc(payload: any) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.UPC_REQ, Number(this.storageService.fnGetUserSequenceNumber()));

    this.http.post(`/serverapi`, reqMsg)

      // .pipe(timeout(HEADER.TIMER.T405),
      //   retry(HEADER.RETRIVE.R405))

      .subscribe((rspMsg: any) => {
        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.UPC_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); return;
        }

        else if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_UPC.OK) { // success
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
      }, (err) => {
        if (err.timeout) {
          console.log('In timeout error which is -> ', err);
        }
        else {
          console.log('Error which is -> ', err);
        }
      });
  }

  /** fnFpu */
  fnFpu(payload: any) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.FPU_REQ, HEADER.NULL_VALUE);

    this.http.post(`/serverapi`, reqMsg)

      // .pipe(timeout(HEADER.TIMER.T406),
      //   retry(HEADER.RETRIVE.R406))

      .subscribe((rspMsg: any) => {
        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.FPU_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); return;
        }

        else if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_FPU.OK) { // success
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
      }, (err) => {
        if (err.timeout) {
          console.log('In timeout error which is -> ', err);
        }
        else {
          console.log('Error which is -> ', err);
        }
      });
  }

  /** fnUdr */
  fnUdr(payload: any) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.UDR_REQ, this.storageService.fnGetUserSequenceNumber());

    this.http.post(`/serverapi`, reqMsg)

      // .pipe(timeout(HEADER.TIMER.T407),
      //   retry(HEADER.RETRIVE.R407))

      .subscribe((rspMsg: any) => {
        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.UDR_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); return;
        }

        else if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_UDR.OK) { // success
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
      }, (err) => {
        if (err.timeout) {
          console.log('In timeout error which is -> ', err);
        }
        else {
          console.log('Error which is -> ', err);
        }
      });

    return HEADER.RES_SUCCESS;
  }

  /** fnAuv */
  fnAuv(payload: any, cb) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.AUV_REQ, this.storageService.fnGetUserSequenceNumber());
    console.log("AUV-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)

      // .pipe(timeout(HEADER.TIMER.T408),
      //   retry(HEADER.RETRIVE.R408))

      .subscribe((rspMsg: any) => {
        console.log("AUV-RSP => ", rspMsg);
        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.AUV_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER');
          cb(HEADER.NULL_VALUE); return;
        }

        else if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_AUV.OK) { // success
          cb(rspMsg);
        }

        else {
          switch (rspMsg.payload.resultCode) {

            case (HEADER.RESCODE_SWP_AUV.OTHER): // reject-other
              this.dispMsgService.fnDispErrorString('OTHER');
              cb(HEADER.NULL_VALUE); break;

            case (HEADER.RESCODE_SWP_AUV.UNALLOCATED_USER_SEQUENCE_NUMBER): // reject-unallocated user sequence number
              this.dispMsgService.fnDispErrorString('UNALLOCATED_USER_SEQUENCE_NUMBER');
              cb(HEADER.NULL_VALUE); break;

            case (HEADER.RESCODE_SWP_AUV.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS): // reject-incorrect number of signed-in completions
              this.dispMsgService.fnDispErrorString('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS');
              cb(HEADER.NULL_VALUE); break;

            case (HEADER.RESCODE_SWP_AUV.UNAUTHORIZED_USER_SEQUENCE_NUMBER): // reject-unauthorized user sequence number
              this.dispMsgService.fnDispErrorString('UNAUTHORIZED_USER_SEQUENCE_NUMBER');
              this.fnSgo({ nsc: this.storageService.fnGetNumberOfSignedInCompletions() });
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
  }
}
