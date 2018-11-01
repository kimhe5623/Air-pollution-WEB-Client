import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { MSGTYPE, TIMER, RETRIVE } from 'src/app/header';
import { MsgService } from '../msg.service';
import { UserManagementService } from './user-management.service';

@Injectable({
  providedIn: 'root'
})
export class SensorManagementService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private msgService: MsgService,
    private umService: UserManagementService) { }


  /** ASR */
  ASR(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.ASR_REQ, this.storageService.get('userInfo').usn);
    console.log('ASR-REQ => ', reqMsg);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        console.log('ASR-RSP => ', rspMsg);

        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.ASR_RSP, reqMsg.header.endpointId)) {
          cb(false); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0):  // success
              alert('Successfully registered');
              cb(true);
              break;

            case (1): // reject-other
              alert('Unknown error');
              cb(false);
              break;;

            case (2):  // reject-unallocated user sequence number
              alert('Unallocated user sequence number.');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload, () => {
                cb(false);
              });
              break;

            case (3): // reject-unauthorized user sequence number
              alert('Unauthorized user sequence number.');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload, () => {
                cb(false);
              });
              break;
          }
        }
      });
  }

  /** ASD */
  ASD(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.ASD_REQ, this.storageService.get('userInfo').usn);

    console.log('ASD-REQ => ', reqMsg);
    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        console.log('ASD-RSP => ', rspMsg);
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.ASD_RSP, reqMsg.header.endpointId)) {
          cb(false); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0):  // success
              alert('Successfully deregistered');
              cb(true);
              break;

            case (1): // reject-other
              alert('Unknown error');
              cb(false);
              break;

            case (2):  // reject-unallocated user sequence number
              alert('Unallocated user sequence number.');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload, () => {
                cb(false);
              });
              break;

            case (3):  // reject-incorrect number of signed-in completions
              alert('Already signed in another computer');
              cb(false);
              break;

            case (4): // reject-unauthorized user sequence number
              alert('Unauthorized user sequence number.');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload, () => {
                cb(false);
              });
              break;

            case (5): // reject-not exist WiFi MAC address
              alert('Not exist Wifi MAC address');
              cb(false);
              break;

            case (6): // reject-not exist user ID
              alert('Not exist user ID');
              cb(false);
              break;

            case (7): // reject-the requested WiFi MAC address is not an associated with user ID
              alert('the requested WiFi MAC address is not an associated with user ID');
              cb(false);
              break;
          }
        }
      });
  }

  /** ASV */
  ASV(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.ASV_REQ, this.storageService.get('userInfo').usn);
    console.log(reqMsg);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {

        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.ASV_RSP, reqMsg.header.endpointId)) {
          cb(null); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              cb(rspMsg);
              break;

            case (1): // reject-other
              alert('Unknown error');
              cb(null);
              break;

            case (2): // reject-unallocated user sequence number
              alert('Unallocated user sequence number.');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload, () => {
                cb(null);
              });
              break;

            case (3): // reject-unauthorized user sequence number
              alert('Unauthorized user sequence number.');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload, () => {
                cb(null);
              });
              break;
          }
        }
      });
  }


  /** SRG */
  SRG(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.SRG_REQ, this.storageService.get('userInfo').usn);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {

        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.SRG_RSP, reqMsg.header.endpointId)) {
          cb(false); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              alert('Successfully registered');
              cb(true);
              break;

            case (1): // reject-other
              alert('Unknown error');
              cb(false)
              break;

            case (2): // reject-unallocated user sequence number
              alert('Invalid user sequence number. Login again');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload, () => {
                cb(false);
              });
              break;

            case (3):  // reject-incorrect number of signed-in completions
              alert('Already signed in another computer');
              cb(false);
              break;
          }
        }
      });
  }

  /** SAS */
  SAS(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.SAS_REQ, this.storageService.get('userInfo').usn);
    console.log("SAS-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        console.log("SAS-RSP => ", rspMsg);
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.SAS_RSP, reqMsg.header.endpointId)) {
          cb(false); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              alert('Successfully associated');
              cb(true);
              break;

            case (1): // reject-other
              alert('Unknown error');
              cb(false);
              break;

            case (2): // reject-unallocated user sequence number
              alert('Invalid user sequence number. Login again');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload, () => {
                cb(false);
              });
              break;

            case (3):  // reject-incorrect number of signed-in completions
              alert('Already signed in another computer');
              cb(false);
              break;

            case (4): // reject-not exist Wifi MAC address
              alert('Not exist wifi MAC address. Try another one');
              cb(false);
              break;

            case (5): // reject-the requested WiFi MAC address was already associated with own user sequence number
              alert('Already associated sensor. Try another one');
              cb(false);
              break;

          }
        }
      });
  }

  /** SDD */
  SDD(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.SDD_REQ, this.storageService.get('userInfo').usn);
    console.log("HTTP:SDD-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        console.log("HTTP:SDD-RSP => ", rspMsg);
        console.log("ResultCode: ", rspMsg.payload.resultCode);
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.SDD_RSP, reqMsg.header.endpointId)) {
          cb(false); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              alert('Successfully dissociated');
              cb(true);
              break;

            case (1): // reject-other
              alert('Unknown error');
              cb(false);
              break;

            case (2): // reject-unallocated user sequence number
              alert('Invalid user sequence number. Login again');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload, () => {
                cb(false);
              });
              break;

            case (3): // reject-not exist Wifi MAC address
              alert('The selected wifi MAC address is not exist. Try again');
              cb(false);
              break;

            case (4): // reject-the requested user sequence number and WiFi MAC addresss are not associated
              alert('The selected wifi MAC address is not associated. Try again');
              cb(false);
              break;
          }
        }
      });
  }


  /** SLV */
  SLV(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.SLV_REQ, this.storageService.get('userInfo').usn);
    console.log("HTTP:SLV-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        console.log("HTTP:SLV:RSP => ", rspMsg);

        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.SLV_RSP, reqMsg.header.endpointId)) {
          cb(null); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              cb(rspMsg);
              break;

            case (1): // reject-other
              alert('Unknown error');
              this.router.navigate(['/dashboard']);
              cb(null);
              break;

            case (2): // reject-unallocated user sequence number
              alert('Invalid user sequence number. Login again');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload, () => {
                cb(null);
              });
              break;
          }
        }
      });
  }
}
