import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { MsgService } from '../msg.service';
import { UserManagementService } from 'src/app/services/httpRequest/user-management.service';
import { MSGTYPE, TIMER, RETRIVE, GOOGLE_MAP_API_KEY } from 'src/app/header';

@Injectable({
  providedIn: 'root'
})
export class DataMonitoringService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private msgService: MsgService,
    private umService: UserManagementService,
    private router: Router) { }

  /**
   * Latlng to address
   */
  latlngToAddress(lat: number, lng: number, cb) {
    this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAP_API_KEY}`)
      .subscribe((result) => {
        //console.log('latlngToAddress function: ', result);
        cb(result);
      });
  }


  /** RAV */
  RAV(payload: any, cb) {
    var usn;
    if (this.storageService.get('userInfo') != null) {
      usn = Number(this.storageService.get('userInfo').usn)
    }
    else usn = 0x000000;

    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.RAV_REQ, usn);
    //console.log("HTTP:RAV-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        //console.log("HTTP:RAV-RSP => ", rspMsg);
        cb(rspMsg);
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.RAV_RSP, reqMsg.header.endpointId)) {
          cb(null); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0):  // success
              cb(rspMsg); break;

            case (1): // reject-other
              alert('Unknown error');
              cb(null); break;

            case (2):  // reject-unallocated user sequence number
              alert('Unallocated user sequence number.');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload, () => {
                this.router.navigate(['/']);
                cb(null);
              });
              break;

            case (3): // reject-incorrect number of signed-in completions
              alert('Already signed in another computer.');
              cb(null); break;
          }
        }
      });
  }

  /** RHV */
  RHV(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.RHV_REQ, Number(this.storageService.get('userInfo').usn));
    console.log('RHV-REQ => ', reqMsg);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        console.log('RHV-RSP => ', rspMsg);
        cb(rspMsg);
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.RHV_RSP, reqMsg.header.endpointId)) {
          cb(null); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0):  // success
              cb(rspMsg); break;

            case (1): // reject-other
              alert('Unknown error');
              cb(null); break;

            case (2):  // reject-unallocated user sequence number
              alert('Unallocated user sequence number');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload, () => {
                this.router.navigate(['/']);
                cb(null);
              });
              break;

            case (3): // reject-incorrect number of signed-in completions
              alert('Already signed in another computer');
              cb(null); break;
          }
        }
      });
  }

  /** HAV */
  HAV(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.HAV_REQ, Number(this.storageService.get('userInfo').usn));
    console.log("HAV-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        console.log("HAV-RSP => ", rspMsg);

        cb(rspMsg);
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.HAV_RSP, reqMsg.header.endpointId)) {
          cb(null); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0):  // success
              cb(rspMsg); break;

            case (1): // reject-other
              alert('Unknown error');
              cb(null); break;

            case (2):  // reject-unallocated user sequence number
              alert('Unallocated user sequence number.');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload, () => {
                this.router.navigate(['/']);
                cb(null);
              });
              break;

            case (3): // reject-requested by an unauthorized user sequence number
              alert('Unauthorized user sequence number.');
              cb(null);
              break;

            case (4): // reject-not exist a sensor under the spatial-temporal search condition included in the SDP: HAV-REQ message
              cb(null);
              break;
          }
        }
      });
  }

  /** SHR */
  SHR(payload: any, cb) {

    var reqMsg: any;

    if (this.storageService.get('userInfo') != null) {
      reqMsg = this.msgService.packingMsg(payload, MSGTYPE.SHR_REQ, Number(this.storageService.get('userInfo').usn));
    }
    else {
      reqMsg = this.msgService.packingMsg(payload, MSGTYPE.SHR_REQ, 0);
    }
    console.log('SHR-REQ => ', reqMsg);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        console.log('SHR-RSP => ', rspMsg);
        cb(rspMsg);
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.SHR_RSP, reqMsg.header.endpointId)) {
          cb(null);
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0):  // success
              cb(rspMsg);
              break;

            case (1): // reject-other
              alert('Unknown error');
              cb(null);
              break;

            case (2):  // reject-unallocated user sequence number
              alert('Unallocated user sequence number.');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload, () => {
                this.router.navigate(['/']);
                cb(null);
              });
              break;

            case (3): // reject-incorrect number of signed in completions
              alert('Already signed in another computer');
              cb(null);
              break;

            case (4): // reject-unauthorized user sequece number
              cb(null);
              break;
          }
        }
      });
  }

  /** HHV */
  HHV(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.HHV_REQ, this.storageService.get('userInfo').usn);
    console.log('HHV-REQ => ', reqMsg);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        console.log('HHV-RSP => ', rspMsg);
        cb(rspMsg);
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.HHV_RSP, reqMsg.header.endpointId)) {
          cb(null); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0):  // success
              cb(rspMsg);
              break;

            case (1): // reject-other
              alert('Unknown error');
              cb(null);
              break;

            case (2):  // reject-unallocated user sequence number
              alert('Unallocated user sequence number.');
              var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };
              this.umService.SGO(SGO_payload, () => {
                this.router.navigate(['/']);
                cb(null);
              });
              break;

            case (3): // reject-incorrect number of signed in completions
              alert('Already signed in another computer');
              cb(null);
              break;

            case (4): // reject-unauthorized user sequece number
              cb(null);
              break;
          }
        }
      });
  }

  /** KAS */
  KAS(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.KAS_REQ, this.storageService.get('userInfo').usn);
    console.log('KAS-REQ => ', reqMsg);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        console.log('KAS-RSP => ', rspMsg);
        cb(rspMsg);
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.KAS_RSP, reqMsg.header.endpointId)) {
          cb(null); return;
        }

        else {
          var SGO_payload = { nsc: this.storageService.get('userInfo').nsc };

          switch (rspMsg.payload.resultCode) {
            case (0):  // success
              cb(rspMsg);
              break;

            case (1): // reject-other
              alert('Unknown error');
              this.umService.SGO(SGO_payload, () => {
                cb(null);
              });
              break;

            case (2):  // reject-unallocated user sequence number
              alert('Unallocated user sequence number.');
              this.umService.SGO(SGO_payload, () => {
                this.router.navigate(['/']);
                cb(null);
              });
              break;

            case (3): // reject-incorrect number of signed in completions
              alert('Already signed in another computer');
              cb(null);
              break;
          }
        }
      });
  }
}
