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
  ASR(payload: any): boolean {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.ASR_REQ, this.storageService.get('userInfo').usn);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        if (!this.msgService.isValidHeader(rspMsg.header, MSGTYPE.ASR_RSP, reqMsg.header.endpointId)) return false;

        else {
          switch (rspMsg.payload.resultCode) {
            case (0):  // success
              alert('Successfully registered');
              break;
            case (1): // reject-other
              alert('Unknown error');
              return false;

            case (2):  // reject-unallocated user sequence number
              alert('Unallocated user sequence number.');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload);
              return false;

            case (3): // reject-unauthorized user sequence number
              alert('Unauthorized user sequence number.');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload);
              return false;
          }
        }
      });
    return true;
  }

  /** ASD */
  ASD(payload: any): boolean {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.ASD_REQ, this.storageService.get('userInfo').usn);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        if (!this.msgService.isValidHeader(rspMsg.header, MSGTYPE.ASD_RSP, reqMsg.header.endpointId)) return false;

        else {
          switch (rspMsg.payload.resultCode) {
            case (0):  // success
              break;

            case (1): // reject-other
              alert('Unknown error');
              return false;

            case (2):  // reject-unallocated user sequence number
              alert('Unallocated user sequence number.');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload);
              return false;

            case (3): // reject-unauthorized user sequence number
              alert('Unauthorized user sequence number.');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload);
              return false;

            case (4): // reject-not exist WiFi MAC address
              alert('Not exist Wifi MAC address');
              return false;

            case (5): // reject-not exist user ID
              alert('Not exist user ID');
              return false;

            case (6): // reject-the requested WiFi MAC address is not an associated with user ID
              alert('the requested WiFi MAC address is not an associated with user ID');
              return false;
          }
        }
      });
    return true;
  }

  /** ASV */
  ASV(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.ASV_REQ, this.storageService.get('userInfo').usn);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {

        if (!this.msgService.isValidHeader(rspMsg.header, MSGTYPE.ASV_RSP, reqMsg.header.endpointId)){
          cb(null); return;
        } 

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              cb(rspMsg); break;
            case (1): // reject-other
              alert('Unknown error');
              cb(null); break;

            case (2): // reject-unallocated user sequence number
              alert('Unallocated user sequence number.');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload);
              cb(null); break;

            case (3): // reject-unauthorized user sequence number
              alert('Unauthorized user sequence number.');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload);
              cb(null); break;

            default:
              cb(null); break;
          }
        }
      });
  }


  /** SRG */
  SRG(payload: any): boolean {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.SRG_REQ, this.storageService.get('userInfo').usn);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        
        if (!this.msgService.isValidHeader(rspMsg.header, MSGTYPE.SRG_RSP, reqMsg.header.endpointId)) return false;

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              alert('Successfully registered');
              break;
            case (1): // reject-other
              alert('Unknown error');
              return false;

            case (2): // reject-unallocated user sequence number
              alert('Invalid user sequence number. Login again');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload);
              return false;
          }
        }
      });
    return true;
  }

  /** SAS */
  SAS(payload: any): boolean {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.SAS_REQ, this.storageService.get('userInfo').usn);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        if (!this.msgService.isValidHeader(rspMsg.header, MSGTYPE.SAS_RSP, reqMsg.header.endpointId)) return false;

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              alert('Successfully associated');
              break;

            case (1): // reject-other
              alert('Unknown error');
              return false;

            case (2): // reject-unallocated user sequence number
              alert('Invalid user sequence number. Login again');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload);
              return false;

            case (3): // reject-not exist Wifi MAC address
              alert('Not exist wifi MAC address. Try another one');
              return false;

            case (4): // reject-the requested WiFi MAC address was already associated with own user sequence number
              alert('Already associated sensor. Try another one');
              return false;
          }
        }
      });
    return true;
  }

  /** SDD */
  SDD(payload: any): boolean {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.SDD_REQ, this.storageService.get('userInfo').usn);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        if (!this.msgService.isValidHeader(rspMsg.header, MSGTYPE.SDD_RSP, reqMsg.header.endpointId)) return false;

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              alert('Successfully diassociated');
              break;

            case (1): // reject-other
              alert('Unknown error');
              return false;

            case (2): // reject-unallocated user sequence number
              alert('Invalid user sequence number. Login again');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload);
              return false;

            case (3): // reject-not exist Wifi MAC address
              alert('The selected wifi MAC address is not exist. Try again');
              return false;

            case (4): // reject-the requested user sequence number and WiFi MAC addresss are not associated
              alert('The selected wifi MAC address is not associated. Try again');
              return false;
          }
        }
      });
    return true;
  }


  /** SLV */
  SLV(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.SLV_REQ, this.storageService.get('userInfo').usn);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {

        if (!this.msgService.isValidHeader(rspMsg.header, MSGTYPE.SLV_RSP, reqMsg.header.endpointId)) {
          cb(null); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              cb(rspMsg); break;

            case (1): // reject-other
              alert('Unknown error');
              this.router.navigate(['/dashboard']);
              cb(null); break;

            case (2): // reject-unallocated user sequence number
              alert('Invalid user sequence number. Login again');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload);
              cb(null); break;
            
            default:
              cb(null); break;
          }
        }
      });
  }
}
