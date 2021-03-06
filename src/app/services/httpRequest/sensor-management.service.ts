import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout, retry } from 'rxjs/operators';
import { StorageService } from 'src/app/services/storage.service';
import { HEADER } from 'src/app/header';
import { MsgService } from '../msg.service';
import { DisplayMessageService } from '../display-message.service';
import { StateMachineManagementService } from '../state-machine-management.service';

@Injectable({
  providedIn: 'root'
})
export class SensorManagementService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private msgService: MsgService,
    private dispMsgService: DisplayMessageService,
    private stateService: StateMachineManagementService
    ) { }


  /** fnAsr */
  fnAsr(payload: any, cb) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.ASR_REQ, Number(this.storageService.fnGetUserSequenceNumber()));
    this.dispMsgService.printLog(['SENT', 'MSG', 'SWP:ASR-REQ']);

    this.stateService.fnStateOfUsnTransitChange(HEADER.MSGTYPE.ASR_REQ, 0, 0, null);

    this.http.post(`/serverapi`, reqMsg)

      .pipe(timeout(HEADER.TIMER.T409),
        retry(HEADER.RETRIVE.R409))

      .subscribe((rspMsg: any) => {
        this.dispMsgService.printLog(['RCVD', 'MSG', 'SWP:ASR-RSP']);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.ASR_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); 
          cb(HEADER.RES_FAILD); return;
        }
        else {
          this.dispMsgService.printLog(['UNPK', 'PYLD', 'SWP:ASR-RSP', 'resultCode: '+rspMsg.payload.resultCode.toString()]);
          this.stateService.fnStateOfUsnTransitChange(0, HEADER.MSGTYPE.ASR_RSP, rspMsg.payload.resultCode, null);

          if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_ASR.OK) { // success
            this.dispMsgService.fnDispSuccessString('SENSOR_REG_COMPLETED', reqMsg.payload.wmac);
            cb(HEADER.RES_SUCCESS);
          }
          else {
            switch (rspMsg.payload.resultCode) {
              case (HEADER.RESCODE_SWP_ASR.OTHER): // reject-other
                this.dispMsgService.fnDispErrorString('OTHER');
                break;
              case (HEADER.RESCODE_SWP_ASR.UNALLOCATED_USER_SEQUENCE_NUMBER):  // reject-unallocated user sequence number
                this.dispMsgService.fnDispErrorString('UNALLOCATED_USER_SEQUENCE_NUMBER');
                break;
              case (HEADER.RESCODE_SWP_ASR.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS):  // reject-incorrect number of signed in completions
                this.dispMsgService.fnDispErrorString('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS');
                break;
              case (HEADER.RESCODE_SWP_ASR.UNAUTHORIZED_USER_SEQUENCE_NUMBER): // reject-unauthorized user sequence number
                this.dispMsgService.fnDispErrorString('UNAUTHORIZED_USER_SEQUENCE_NUMBER');
                break;
            }
            cb(HEADER.RES_FAILD);
          }

        }
      }, (err) => {
        if (err.timeout || err.status == 504) {
          this.dispMsgService.fnDispErrorString('CONNECTION_ERR');
          this.dispMsgService.printLog(['TMOT', 'CONN', 'ERR', JSON.stringify(err)]);
          this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T409');
        }
        else {
          this.dispMsgService.printLog(['ERR', 'OTHR', JSON.stringify(err)]);
        }
      });
  }

  /** ASD */
  fnAsd(payload: any) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.ASD_REQ, Number(this.storageService.fnGetUserSequenceNumber()));
    this.dispMsgService.printLog(['SENT', 'MSG', 'SWP:ASD-REQ']);

    this.stateService.fnStateOfUsnTransitChange(HEADER.MSGTYPE.ASD_REQ, 0, 0, null);

    this.http.post(`/serverapi`, reqMsg)

      .pipe(timeout(HEADER.TIMER.T410),
        retry(HEADER.RETRIVE.R410))

      .subscribe((rspMsg: any) => {
        this.dispMsgService.printLog(['RCVD', 'MSG', 'SWP:ASD-RSP']);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.ASD_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); 
          return;
        }
        else {
          this.dispMsgService.printLog(['UNPK', 'PYLD', 'SWP:ASD-RSP', 'resultCode: '+rspMsg.payload.resultCode.toString()]);
          this.stateService.fnStateOfUsnTransitChange(0, HEADER.MSGTYPE.ASD_RSP, rspMsg.payload.resultCode, null);

          if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_ASD.OK) { // success
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
        }

      }, (err) => {
        if (err.timeout || err.status == 504) {
          this.dispMsgService.fnDispErrorString('CONNECTION_ERR');
          this.dispMsgService.printLog(['TMOT', 'CONN', 'ERR', JSON.stringify(err)]);
          this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T410');
        }
        else {
          this.dispMsgService.printLog(['ERR', 'OTHR', JSON.stringify(err)]);
        }
      });
  }

  /** ASV */
  fnAsv(payload: any, cb) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.ASV_REQ, Number(this.storageService.fnGetUserSequenceNumber()));
    this.dispMsgService.printLog(['SENT', 'MSG', 'SWP:ASV-REQ']);

    this.stateService.fnStateOfUsnTransitChange(HEADER.MSGTYPE.ASV_REQ, 0, 0, null);

    this.http.post(`/serverapi`, reqMsg)

      .pipe(timeout(HEADER.TIMER.T411),
        retry(HEADER.RETRIVE.R411))

      .subscribe((rspMsg: any) => {
        this.dispMsgService.printLog(['RCVD', 'MSG', 'SWP:ASV-RSP']);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.ASV_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER');
          cb(HEADER.NULL_VALUE); return;
        }
        else {
          this.dispMsgService.printLog(['UNPK', 'PYLD', 'SWP:ASV-RSP', 'resultCode: '+rspMsg.payload.resultCode.toString()]);
          this.stateService.fnStateOfUsnTransitChange(0, HEADER.MSGTYPE.ASV_RSP, rspMsg.payload.resultCode, null);

          if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_ASV.OK) { // success
            cb(rspMsg);
          }
          else {
            switch (rspMsg.payload.resultCode) {
              case (HEADER.RESCODE_SWP_ASV.OTHER): // reject-other
                this.dispMsgService.fnDispErrorString('OTHER');
                break;
              case (HEADER.RESCODE_SWP_ASV.UNALLOCATED_USER_SEQUENCE_NUMBER): // reject-unallocated user sequence number
                this.dispMsgService.fnDispErrorString('UNALLOCATED_USER_SEQUENCE_NUMBER');
                break;
              case (HEADER.RESCODE_SWP_ASV.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS): // reject-incorrect number of signed in completions
                this.dispMsgService.fnDispErrorString('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS');
                break;
              case (HEADER.RESCODE_SWP_ASV.UNAUTHORIZED_USER_SEQUENCE_NUMBER): // reject-unauthorized user sequence number
                this.dispMsgService.fnDispErrorString('UNAUTHORIZED_USER_SEQUENCE_NUMBER');
                break;
            }
            cb(HEADER.NULL_VALUE);
          }

        }
      }, (err) => {
        if (err.timeout || err.status == 504) {
          this.dispMsgService.fnDispErrorString('CONNECTION_ERR');
          this.dispMsgService.printLog(['TMOT', 'CONN', 'ERR', JSON.stringify(err)]);
          this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T411');
        }
        else {
          this.dispMsgService.printLog(['ERR', 'OTHR', JSON.stringify(err)]);
        }
      });
  }


  /** SRG */
  fnSrg(payload: any, cb) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.SRG_REQ, Number(this.storageService.fnGetUserSequenceNumber()));
    this.dispMsgService.printLog(['SENT', 'MSG', 'SWP:SRG-REQ']);

    this.stateService.fnStateOfUsnTransitChange(HEADER.MSGTYPE.SRG_REQ, 0, 0, null);
    
    this.http.post(`/serverapi`, reqMsg)

      .pipe(timeout(HEADER.TIMER.T412),
        retry(HEADER.RETRIVE.R412))

      .subscribe((rspMsg: any) => {
        this.dispMsgService.printLog(['RCVD', 'MSG', 'SWP:SRG-RSP']);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.SRG_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER');
          cb(HEADER.RES_FAILD); return;
        }
        else {
          this.dispMsgService.printLog(['UNPK', 'PYLD', 'SWP:SRG-RSP', 'resultCode: '+rspMsg.payload.resultCode.toString()]);
          this.stateService.fnStateOfUsnTransitChange(0, HEADER.MSGTYPE.SRG_RSP, rspMsg.payload.resultCode, null);

          if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_SRG.OK) { // success
            this.dispMsgService.fnDispSuccessString('SENSOR_REG_COMPLETED', reqMsg.payload.wmac);
            cb(HEADER.RES_SUCCESS);
          }
          else {
            switch (rspMsg.payload.resultCode) {
              case (HEADER.RESCODE_SWP_SRG.OTHER): // reject-other
                this.dispMsgService.fnDispErrorString('OTHER');
                break;
              case (HEADER.RESCODE_SWP_SRG.UNALLOCATED_USER_SEQUENCE_NUMBER): // reject-unallocated user sequence number
                this.dispMsgService.fnDispErrorString('UNALLOCATED_USER_SEQUENCE_NUMBER');
                break;
              case (HEADER.RESCODE_SWP_SRG.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS):  // reject-incorrect number of signed-in completions
                this.dispMsgService.fnDispErrorString('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS');
                break;
            }
            cb(HEADER.RES_FAILD);
          }

        }
      }, (err) => {
        if (err.timeout || err.status == 504) {
          this.dispMsgService.fnDispErrorString('CONNECTION_ERR');
          this.dispMsgService.printLog(['TMOT', 'CONN', 'ERR', JSON.stringify(err)]);
          this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T412');
        }
        else {
          this.dispMsgService.printLog(['ERR', 'OTHR', JSON.stringify(err)]);
        }
      });
  }

  /** SAS */
  fnSas(payload: any, cb) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.SAS_REQ, Number(this.storageService.fnGetUserSequenceNumber()));
    this.dispMsgService.printLog(['SENT', 'MSG', 'SWP:SAS-REQ']);

    this.stateService.fnStateOfUsnTransitChange(HEADER.MSGTYPE.SAS_REQ, 0, 0, null);

    this.http.post(`/serverapi`, reqMsg)

      .pipe(timeout(HEADER.TIMER.T413),
        retry(HEADER.RETRIVE.R413))

      .subscribe((rspMsg: any) => {
        this.dispMsgService.printLog(['RCVD', 'MSG', 'SWP:SAS-RSP']);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.SAS_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); 
          cb(HEADER.RES_FAILD); return;
        }
        else {
          this.dispMsgService.printLog(['UNPK', 'PYLD', 'SWP:SAS-RSP', 'resultCode: '+rspMsg.payload.resultCode.toString()]);
          this.stateService.fnStateOfUsnTransitChange(0, HEADER.MSGTYPE.SAS_RSP, rspMsg.payload.resultCode, null);

          if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_SAS.OK) { // success
            this.dispMsgService.fnDispSuccessString('SENSOR_ASSOCIATION_COMPLETED', reqMsg.payload.wmac);
            cb(HEADER.RES_SUCCESS);
          }
          else {
            switch (rspMsg.payload.resultCode) {
              case (HEADER.RESCODE_SWP_SAS.OTHER): // reject-other
                this.dispMsgService.fnDispErrorString('OTHER');
                break;
              case (HEADER.RESCODE_SWP_SAS.UNALLOCATED_USER_SEQUENCE_NUMBER): // reject-unallocated user sequence number
                this.dispMsgService.fnDispErrorString('UNALLOCATED_USER_SEQUENCE_NUMBER');
                break;
              case (HEADER.RESCODE_SWP_SAS.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS):  // reject-incorrect number of signed-in completions
                this.dispMsgService.fnDispErrorString('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS');
                break;
              case (HEADER.RESCODE_SWP_SAS.NOT_EXIST_WIFI_MAC_ADDRESS): // reject-not exist Wifi MAC address
                this.dispMsgService.fnDispErrorString('NOT_EXIST_WIFI_MAC_ADDRESS');
                break;
              case (HEADER.RESCODE_SWP_SAS.ALREADY_ASSOCIATED_WITH_USN): // reject-the requested WiFi MAC address was already associated with the user sequence number
                this.dispMsgService.fnDispErrorString('ALREADY_ASSOCIATED_WITH_USN');
                break;
              case (HEADER.RESCODE_SWP_SAS.ALREADY_ASSOCIATED_WITH_OTHER): // reject-the requested WiFi MAC address was already associated with the user sequence number
                this.dispMsgService.fnDispErrorString('ALREADY_ASSOCIATED_WITH_OTHER');
                break;
            }
            cb(HEADER.RES_FAILD);
          }

        }
      }, (err) => {
        if (err.timeout || err.status == 504) {
          this.dispMsgService.fnDispErrorString('CONNECTION_ERR');
          this.dispMsgService.printLog(['TMOT', 'CONN', 'ERR', JSON.stringify(err)]);
          this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T413');
        }
        else {
          this.dispMsgService.printLog(['ERR', 'OTHR', JSON.stringify(err)]);
        }
      });
  }

  /** SDD */
  fnSdd(payload: any) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.SDD_REQ, Number(this.storageService.fnGetUserSequenceNumber()));
    this.dispMsgService.printLog(['SENT', 'MSG', 'SWP:SDD-REQ']);

    this.stateService.fnStateOfUsnTransitChange(HEADER.MSGTYPE.SDD_REQ, 0, 0, null);

    this.http.post(`/serverapi`, reqMsg)

      .pipe(timeout(HEADER.TIMER.T414),
        retry(HEADER.RETRIVE.R414))

      .subscribe((rspMsg: any) => {
        this.dispMsgService.printLog(['RCVD', 'MSG', 'SWP:SDD-RSP']);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.SDD_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER'); 
          return;
        }
        else {
          this.dispMsgService.printLog(['UNPK', 'PYLD', 'SWP:SDD-RSP', 'resultCode: '+rspMsg.payload.resultCode.toString()]);
          this.stateService.fnStateOfUsnTransitChange(0, HEADER.MSGTYPE.SDD_RSP, rspMsg.payload.resultCode, null);

          if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_SDD.OK) { // success
            this.dispMsgService.fnDispSuccessString('SENSOR_DELETE_COMPLETED', null);
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

        }
      }, (err) => {
        if (err.timeout || err.status == 504) {
          this.dispMsgService.fnDispErrorString('CONNECTION_ERR');
          this.dispMsgService.printLog(['TMOT', 'CONN', 'ERR', JSON.stringify(err)]);
          this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T414');
        }
        else {
          this.dispMsgService.printLog(['ERR', 'OTHR', JSON.stringify(err)]);
        }
      });
  }


  /** SLV */
  fnSlv(payload: any, cb) {
    var reqMsg: any = this.msgService.fnPackingMsg(payload, HEADER.MSGTYPE.SLV_REQ, Number(this.storageService.fnGetUserSequenceNumber()));
    this.dispMsgService.printLog(['SENT', 'MSG', 'SWP:SLV-REQ']);

    this.stateService.fnStateOfUsnTransitChange(HEADER.MSGTYPE.SLV_REQ, 0, 0, null);

    this.http.post(`/serverapi`, reqMsg)

      .pipe(timeout(HEADER.TIMER.T415),
        retry(HEADER.RETRIVE.R415))

      .subscribe((rspMsg: any) => {
        this.dispMsgService.printLog(['RCVD', 'MSG', 'SWP:SLV-RSP']);

        if (!this.msgService.fnVerifyMsgHeader(rspMsg, HEADER.MSGTYPE.SLV_RSP, reqMsg.header.endpointId)) {
          this.dispMsgService.fnDispErrorString('INCORRECT_HEADER');
          cb(HEADER.NULL_VALUE); return;
        }
        else {
          this.dispMsgService.printLog(['UNPK', 'PYLD', 'SWP:SLV-RSP', 'resultCode: '+rspMsg.payload.resultCode.toString()]);
          this.stateService.fnStateOfUsnTransitChange(0, HEADER.MSGTYPE.SLV_RSP, rspMsg.payload.resultCode, null);

          if(rspMsg.payload.resultCode == HEADER.RESCODE_SWP_SLV.OK) { // success
            cb(rspMsg);
          }
          else {
            switch (rspMsg.payload.resultCode) {
              case (HEADER.RESCODE_SWP_SLV.OTHER): // reject-other
                this.dispMsgService.fnDispErrorString('OTHER');
                break;
              case (HEADER.RESCODE_SWP_SLV.UNALLOCATED_USER_SEQUENCE_NUMBER): // reject-unallocated user sequence number
                this.dispMsgService.fnDispErrorString('UNALLOCATED_USER_SEQUENCE_NUMBER');
                break;
              case (HEADER.RESCODE_SWP_SLV.INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS): // reject-incorrect number of signed in completions
                this.dispMsgService.fnDispErrorString('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS');
                break;
            }
            cb(HEADER.NULL_VALUE);
          }

        }
      }, (err) => {
        if (err.timeout || err.status == 504) {
          this.dispMsgService.fnDispErrorString('CONNECTION_ERR');
          this.dispMsgService.printLog(['TMOT', 'CONN', 'ERR', JSON.stringify(err)]);
          this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T415');
        }
        else {
          this.dispMsgService.printLog(['ERR', 'OTHR', JSON.stringify(err)]);
        }
      });
  }
}
