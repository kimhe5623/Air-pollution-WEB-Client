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
    private router: Router,
    private storageService: StorageService,
    private msgService: MsgService,
    private umService: UserManagementService) { }

  /**
   * Latlng to address
   */
  latlngToAddress(lat: number, lng: number, cb) {

    this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAP_API_KEY}`)
      .subscribe((result) => {
        cb(result);
      });
  }


  /** RAV */
  RAV(payload: any, cb) {
    var usn;
    if (this.storageService.get('userInfo') != null) {
      usn = this.storageService.get('userInfo').usn
    }
    else usn = 0x000000;

    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.RAV_REQ, usn);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        cb(rspMsg);
        if (!this.msgService.isValidHeader(rspMsg.header, MSGTYPE.RAV_RSP, reqMsg.header.endpointId)) {
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
              this.umService.SGO(SGO_payload, this.storageService.get('userInfo').usn);
              cb(null); break;

            case (3): // reject-incorrect number of signed-in completions
              alert('Already signed in another computer.');
              cb(null); break;

            default:
              cb(null); break;
          }
        }
      });
  }

  /** RHV */
  RHV(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.RHV_REQ, this.storageService.get('userInfo').usn);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        cb(rspMsg);
        if (!this.msgService.isValidHeader(rspMsg.header, MSGTYPE.RHV_RSP, reqMsg.header.endpointId)) {
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
              this.umService.SGO(SGO_payload, this.storageService.get('userInfo').usn);
              cb(null); break;

            case (3): // reject-incorrect number of signed-in completions
              alert('Already signed in another computer.');
              cb(null); break;

            default:
              cb(null); break;
          }
        }
      });
  }

  /** HAV */
  HAV(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.HAV_REQ, this.storageService.get('userInfo').usn);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        cb(rspMsg);
        if (!this.msgService.isValidHeader(rspMsg.header, MSGTYPE.HAV_RSP, reqMsg.header.endpointId)) {
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
              this.umService.SGO(SGO_payload, this.storageService.get('userInfo').usn);
              cb(null); break;

            case (3): // reject-requested by an unauthorized user sequence number
              alert('Unauthorized user sequence number.');
              cb(null); break;

            case (4): // reject-not exist a sensor under the spatial-temporal search condition included in the SDP: HAV-REQ message
              cb(null); break;
          }
        }
      });
  }

  /** SHR */
  /** HHV */
  /** KAS */
}
