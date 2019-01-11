import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout, retry } from 'rxjs/operators';
import { StorageService } from 'src/app/services/storage.service';
import { HEADER } from 'src/app/header';
import { MsgService } from '../msg.service';
import { DisplayMessageService } from '../display-message.service';

@Injectable({
  providedIn: 'root'
})
export class SensorManagementService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private msgService: MsgService,
    private dispMsgService: DisplayMessageService) { }


  /** fnAsr */
  fnAsr(payload: any, cb) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.ASR_REQ, Number(this.storageService.fnGetUserSequenceNumber()));
    console.log('ASR-REQ => ', reqMsg);

    this.http.post(`/serverapi`, reqMsg)

      // .pipe(timeout(HEADER.TIMER.T409),
      //   retry(HEADER.RETRIVE.R409))

      .subscribe((rspMsg: any) => {
        console.log('ASR-RSP => ', rspMsg);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.ASR_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); 
          cb(HEADER.RES_FAILD); return;
        }

        else if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_ASR.OK) { // success
          this.dispMsgService.fnDispSuccessString('SENSOR_REG_COMPLETED', reqMsg.payload.wmac);
          cb(HEADER.RES_SUCCESS);
        }

        else {
          switch (rspMsg.payload.resultCode) {

            case (HEADER.RESCODE_SWP_ASR.OTHER): // reject-other
              this.dispMsgService.fnDispErrorString('OTHER');
              cb(HEADER.RES_FAILD);
              break;

            case (HEADER.RESCODE_SWP_ASR.UNALLOCATED_USER_SEQUENCE_NUMBER):  // reject-unallocated user sequence number
              this.dispMsgService.fnDispErrorString('UNALLOCATED_USER_SEQUENCE_NUMBER');
              cb(HEADER.RES_FAILD);
              break;


            case (HEADER.RESCODE_SWP_ASR.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS):  // reject-incorrect number of signed in completions
              this.dispMsgService.fnDispErrorString('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS');
              cb(HEADER.RES_FAILD);
              break;


            case (HEADER.RESCODE_SWP_ASR.UNAUTHORIZED_USER_SEQUENCE_NUMBER): // reject-unauthorized user sequence number
              this.dispMsgService.fnDispErrorString('UNAUTHORIZED_USER_SEQUENCE_NUMBER');
              cb(HEADER.RES_FAILD);
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

  /** ASD */
  fnAsd(payload: any) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.ASD_REQ, Number(this.storageService.fnGetUserSequenceNumber()));

    console.log('ASD-REQ => ', reqMsg);
    this.http.post(`/serverapi`, reqMsg)

      // .pipe(timeout(HEADER.TIMER.T410),
      //   retry(HEADER.RETRIVE.R410))

      .subscribe((rspMsg: any) => {
        console.log('ASD-RSP => ', rspMsg);
        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.ASD_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); 
          return;
        }

        else if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_ASD.OK) { // success
          this.dispMsgService.fnDispSuccessString('SENSOR_DELETE_COMPLETED', HEADER.NULL_VALUE);
        }

        else {
          switch (rspMsg.payload.resultCode) {

            case (HEADER.RESCODE_SWP_ASD.OTHER): // reject-other
              this.dispMsgService.fnDispErrorString('OTHER');
              break;

            case (HEADER.RESCODE_SWP_ASD.UNALLOCATED_USER_SEQUENCE_NUMBER):  // reject-unallocated user sequence number
              this.dispMsgService.fnDispErrorString('UNALLOCATED_USER_SEQUENCE_NUMBER');
              break;

            case (HEADER.RESCODE_SWP_ASD.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS):  // reject-incorrect number of signed-in completions
              this.dispMsgService.fnDispErrorString('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS');
              break;

            case (HEADER.RESCODE_SWP_ASD.UNAUTHORIZED_USER_SEQUENCE_NUMBER): // reject-unauthorized user sequence number
              this.dispMsgService.fnDispErrorString('UNAUTHORIZED_USER_SEQUENCE_NUMBER');
              break;

            case (HEADER.RESCODE_SWP_ASD.NOT_EXIST_WIFI_MAC_ADDRESS): // reject-not exist WiFi MAC address
              this.dispMsgService.fnDispErrorString('NOT_EXIST_WIFI_MAC_ADDRESS');
              break;

            case (HEADER.RESCODE_SWP_ASD.NOT_EXIST_USER_ID): // reject-not exist user ID
              this.dispMsgService.fnDispErrorString('NOT_EXIST_USER_ID');
              break;

            case (HEADER.RESCODE_SWP_ASD.NOT_ASSOCIATED_WITH_USER_ID): // reject-the requested WiFi MAC address is not an associated with user ID
              this.dispMsgService.fnDispErrorString('NOT_ASSOCIATED_WITH_USER_ID');
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

  /** ASV */
  fnAsv(payload: any, cb) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.ASV_REQ, Number(this.storageService.fnGetUserSequenceNumber()));
    console.log(reqMsg);

    this.http.post(`/serverapi`, reqMsg)

      // .pipe(timeout(HEADER.TIMER.T411),
      //   retry(HEADER.RETRIVE.R411))

      .subscribe((rspMsg: any) => {

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.ASV_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER');
          cb(HEADER.NULL_VALUE); return;
        }

        else if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_ASV.OK) { // success
          cb(rspMsg);
        }

        else {
          switch (rspMsg.payload.resultCode) {

            case (HEADER.RESCODE_SWP_ASV.OTHER): // reject-other
              this.dispMsgService.fnDispErrorString('OTHER');
              cb(HEADER.NULL_VALUE);
              break;

            case (HEADER.RESCODE_SWP_ASV.UNALLOCATED_USER_SEQUENCE_NUMBER): // reject-unallocated user sequence number
              this.dispMsgService.fnDispErrorString('UNALLOCATED_USER_SEQUENCE_NUMBER');
              cb(HEADER.NULL_VALUE);
              break;

            case (HEADER.RESCODE_SWP_ASV.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS): // reject-incorrect number of signed in completions
              this.dispMsgService.fnDispErrorString('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS');
              cb(HEADER.NULL_VALUE);
              break;

            case (HEADER.RESCODE_SWP_ASV.UNAUTHORIZED_USER_SEQUENCE_NUMBER): // reject-unauthorized user sequence number
              this.dispMsgService.fnDispErrorString('UNAUTHORIZED_USER_SEQUENCE_NUMBER');
              cb(HEADER.NULL_VALUE);
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


  /** SRG */
  fnSrg(payload: any, cb) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.SRG_REQ, Number(this.storageService.fnGetUserSequenceNumber()));

    this.http.post(`/serverapi`, reqMsg)

      // .pipe(timeout(HEADER.TIMER.T412),
      //   retry(HEADER.RETRIVE.R412))

      .subscribe((rspMsg: any) => {

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.SRG_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER');
          cb(HEADER.RES_FAILD); return;
        }

        else if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_SRG.OK) { // success
          this.dispMsgService.fnDispSuccessString('SENSOR_REG_COMPLETED', reqMsg.payload.wmac);
          cb(HEADER.RES_SUCCESS);
        }

        else {
          switch (rspMsg.payload.resultCode) {

            case (HEADER.RESCODE_SWP_SRG.OTHER): // reject-other
              this.dispMsgService.fnDispErrorString('OTHER');
              cb(HEADER.RES_FAILD);
              break;

            case (HEADER.RESCODE_SWP_SRG.UNALLOCATED_USER_SEQUENCE_NUMBER): // reject-unallocated user sequence number
              this.dispMsgService.fnDispErrorString('UNALLOCATED_USER_SEQUENCE_NUMBER');
              cb(HEADER.RES_FAILD);
              break;

            case (HEADER.RESCODE_SWP_SRG.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS):  // reject-incorrect number of signed-in completions
              this.dispMsgService.fnDispErrorString('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS');
              cb(HEADER.RES_FAILD);
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

  /** SAS */
  fnSas(payload: any, cb) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.SAS_REQ, Number(this.storageService.fnGetUserSequenceNumber()));
    console.log("SAS-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)

      // .pipe(timeout(HEADER.TIMER.T413),
      //   retry(HEADER.RETRIVE.R413))

      .subscribe((rspMsg: any) => {
        console.log("SAS-RSP => ", rspMsg);
        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.SAS_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); 
          cb(HEADER.RES_FAILD); return;
        }

        else if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_SAS.OK) { // success
          this.dispMsgService.fnDispSuccessString('SENSOR_ASSOCIATION_COMPLETED', reqMsg.payload.wmac);
          cb(HEADER.RES_SUCCESS);
        }

        else {
          switch (rspMsg.payload.resultCode) {

            case (HEADER.RESCODE_SWP_SAS.OTHER): // reject-other
              this.dispMsgService.fnDispErrorString('OTHER');
              cb(HEADER.RES_FAILD);
              break;

            case (HEADER.RESCODE_SWP_SAS.UNALLOCATED_USER_SEQUENCE_NUMBER): // reject-unallocated user sequence number
              this.dispMsgService.fnDispErrorString('UNALLOCATED_USER_SEQUENCE_NUMBER');
              cb(HEADER.RES_FAILD);
              break;

            case (HEADER.RESCODE_SWP_SAS.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS):  // reject-incorrect number of signed-in completions
              this.dispMsgService.fnDispErrorString('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS');
              cb(HEADER.RES_FAILD);
              break;

            case (HEADER.RESCODE_SWP_SAS.NOT_EXIST_WIFI_MAC_ADDRESS): // reject-not exist Wifi MAC address
              this.dispMsgService.fnDispErrorString('NOT_EXIST_WIFI_MAC_ADDRESS');
              cb(HEADER.RES_FAILD);
              break;

            case (HEADER.RESCODE_SWP_SAS.ALREADY_ASSOCIATED): // reject-the requested WiFi MAC address was already associated with own user sequence number
              this.dispMsgService.fnDispErrorString('ALREADY_ASSOCIATED');
              cb(HEADER.RES_FAILD);
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

  /** SDD */
  fnSdd(payload: any) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.SDD_REQ, Number(this.storageService.fnGetUserSequenceNumber()));
    console.log("HTTP:SDD-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)

      // .pipe(timeout(HEADER.TIMER.T414),
      //   retry(HEADER.RETRIVE.R414))

      .subscribe((rspMsg: any) => {
        console.log("HTTP:SDD-RSP => ", rspMsg);
        console.log("ResultCode: ", rspMsg.payload.resultCode);
        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.SDD_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); 
          return;
        }

        else if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_SDD.OK) { // success
          this.dispMsgService.fnDispSuccessString('SENSOR_ASSOCIATION_COMPLETED', reqMsg.payload.wmac);
        }

        else {
          switch (rspMsg.payload.resultCode) {

            case (HEADER.RESCODE_SWP_SDD.OTHER): // reject-other
              this.dispMsgService.fnDispErrorString('OTHER');
              break;

            case (HEADER.RESCODE_SWP_SDD.UNALLOCATED_USER_SEQUENCE_NUMBER): // reject-unallocated user sequence number
              this.dispMsgService.fnDispErrorString('UNALLOCATED_USER_SEQUENCE_NUMBER');
              break;

            case (HEADER.RESCODE_SWP_SDD.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS): // reject-incorrect number of signed in completions
              this.dispMsgService.fnDispErrorString('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS');
              break;

            case (HEADER.RESCODE_SWP_SDD.NOT_EXIST_WIFI_MAC_ADDRESS): // reject-not exist Wifi MAC address
              this.dispMsgService.fnDispErrorString('NOT_EXIST_WIFI_MAC_ADDRESS');
              break;

            case (HEADER.RESCODE_SWP_SDD.NOT_ASSOCIATED_WITH_USER_ID): // reject-the requested user sequence number and WiFi MAC addresss are not associated
              this.dispMsgService.fnDispErrorString('NOT_ASSOCIATED_WITH_USER_ID');
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


  /** SLV */
  fnSlv(payload: any, cb) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.SLV_REQ, Number(this.storageService.fnGetUserSequenceNumber()));
    console.log("HTTP:SLV-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)

      // .pipe(timeout(HEADER.TIMER.T415),
      //   retry(HEADER.RETRIVE.R415))

      .subscribe((rspMsg: any) => {
        console.log("HTTP:SLV:RSP => ", rspMsg);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.SLV_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER');
          cb(HEADER.NULL_VALUE); return;
        }

        else if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_SLV.OK) { // success
          cb(rspMsg);
        }

        else {
          switch (rspMsg.payload.resultCode) {

            case (HEADER.RESCODE_SWP_SLV.OTHER): // reject-other
              this.dispMsgService.fnDispErrorString('OTHER');
              cb(HEADER.NULL_VALUE);
              break;

            case (HEADER.RESCODE_SWP_SLV.UNALLOCATED_USER_SEQUENCE_NUMBER): // reject-unallocated user sequence number
              this.dispMsgService.fnDispErrorString('UNALLOCATED_USER_SEQUENCE_NUMBER');
              cb(HEADER.NULL_VALUE);
              break;

            case (HEADER.RESCODE_SWP_SLV.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS): // reject-incorrect number of signed in completions
              this.dispMsgService.fnDispErrorString('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS');
              cb(HEADER.NULL_VALUE);
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
