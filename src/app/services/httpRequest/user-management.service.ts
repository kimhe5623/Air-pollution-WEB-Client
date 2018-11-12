import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { MSGTYPE, TIMER, RETRIVE } from 'src/app/header';
import { MsgService } from '../msg.service';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private msgService: MsgService,
    private authService: AuthorizationService) { }


  /** SGU */
  SGU(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.SGU_REQ, null);
    console.log("HTTP:SGU-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        console.log("HTTP:SGU-RSP => ", rspMsg);
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.SGU_RSP, reqMsg.header.endpointId)) {
          cb(false); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              this.router.navigate([`/signup-code`, rspMsg.header.endpointId, reqMsg.payload.userId, rspMsg.payload.vc], { skipLocationChange: true });
              cb(true); break;

            case (1): // reject-other
              alert('Unknown error');
              cb(false); break;

            case (2): // reject-conflict of tci
              alert('Conflict of TCI');
              cb(false); break;

            case (3): // reject-duplicate of user ID
              alert('Duplicate of userID');
              cb(false); break;
          }
        }
      });
  }

  /** UVC */
  UVC(payload: any, EP: number, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.UVC_REQ, EP);
    console.log("HTTP:UVC-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        console.log("HTTP:UVC-RSP => ", rspMsg);
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.UVC_RSP, reqMsg.header.endpointId)) {
          cb(false); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              alert('Signup is completely finished.');
              this.router.navigate([`/signin`]);
              cb(true); break;

            case (1): // reject-other
              alert('Unknown error');
              this.router.navigate(['/']);
              cb(false); break;

            case (2): // reject-duplicate of user ID
              alert('Duplicate of user ID');
              this.router.navigate(['/signup']);
              cb(false); break;

            case (3): // reject-not exist Temporary Client ID
              alert('Not exist Temporary client ID');
              this.router.navigate(['/signup']);
              cb(false); break;

            case (4): // reject-incorrect authentication code under the verification code
              alert('Incorrect authentication code under the verification code');
              cb(false); break;

          }
        }
      });
  }

  /** SGI */
  SGI(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.SGI_REQ, null);
    console.log("HTTP:SGI-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        console.log("HTTP:SGI-RSP => ", rspMsg);
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.SGI_RSP, reqMsg.header.endpointId)) {
          cb(false); return;
        }

        else {

          switch (rspMsg.payload.resultCode) {
            case (0): // success
              var userInfo = { usn: rspMsg.payload.usn, nsc: rspMsg.payload.nsc, email: reqMsg.payload.userID };
              this.storageService.set('userInfo', userInfo);
              alert('Welcome!');

              // Rendering
              if (this.authService.isAdministor(Number(rspMsg.payload.usn))) {
                this.router.navigate(['/administrator']);
              }
              else this.router.navigate([`/dashboard`]);

              cb(true); break;

            case (1): // reject-other
              alert('Unknown error');
              cb(false); break;

            case (2): // reject-conflict of Temporary Client ID
              alert('Conflict of Temporary Client ID');
              cb(false); break;

            case (3): // reject-not exist user ID
              alert('Not exist user ID');
              cb(false); break;

            case (4): // reject-incorrect current user password
              alert('Incorrect password');
              cb(false); break;
          }
        }
      });
  }

  /** SGO */
  SGO(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.SGO_NOT, Number(this.storageService.get('userInfo').usn));
    console.log("HTTP:SGO-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        console.log("HTTP:SGO-RSP => ", rspMsg);
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.UDR_RSP, reqMsg.header.endpointId)) {
          cb(null); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              console.log("Successfully signed out");
              break;

            case (1): // warning-other
              console.log("Unknown warning");
              break;

            case (2): // warning-unallocated user sequence number
              console.log("Unallocated user sequence number");
              break;

            case (3): // warning-incorrect number of signed-in completions
              console.log("Incorrect number of signed-in completions");
              break;
          }
        }
      })

    this.storageService.clear('all');
    cb(null);
  }

  /** UPC */
  UPC(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.UPC_REQ, Number(this.storageService.get('userInfo').usn));

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.UPC_RSP, reqMsg.header.endpointId)) {
          cb(false); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              alert("Password was successfully changed");
              cb(true); break;

            case (1): // reject-other
              alert("Unknown warning");
              cb(false); break;

            case (2): // reject-unallocated user sequence number
              alert("Unallocated user sequence number");
              cb(false); break;

            case (3): // reject-incorrect number of signed-in completions
              alert("Incorrect number of signed-in completions");
              cb(false); break;

            case (4): // reject-incorrect current user password
              alert("Incorrect current password");
              cb(false); break;
          }
        }
      });
  }

  /** FPU */
  FPU(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.FPU_REQ, null);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.FPU_RSP, reqMsg.header.endpointId)) {
          cb(false); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              alert('Temporary password was sended to your email')
              this.router.navigate([`/signin`]);
              cb(true); break;

            case (1): // reject-other
              alert('Unknown error');
              cb(false); break;

            case (2): // reject-conflict of tci
              alert('Conflict of TCI');
              cb(false); break;

            case (3): // reject-incorrect user information
              alert('Incorrect user information');
              cb(false); break;

            case (4): // reject-not exist user ID
              alert('Not exist user ID');
              cb(false); break;
          }
        }
      });
  }

  /** UDR */
  UDR(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.UDR_REQ, this.storageService.get('userInfo').usn);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.UDR_RSP, reqMsg.header.endpointId)) {
          cb(false); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              alert("Successfully deregistered");
              this.storageService.clear('all');
              this.router.navigate([`/`]);
              cb(true); break;

            case (1): // reject-other
              alert("Unknown warning");
              cb(false); break;

            case (2): // reject-unallocated user sequence number
              alert("Unallocated user sequence number");
              cb(false); break;

            case (3): // reject-incorrect number of signed-in completions
              alert("Incorrect number of signed-in completions");
              cb(false); break;

            case (4): // reject-incorrect current user password
              alert("Incorrect entered user password");
              cb(false); break;
          }
        }
      });

    return true;
  }

  /** AUV */
  AUV(payload: any, cb) {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.AUV_REQ, this.storageService.get('userInfo').usn);
    console.log("AUV-REQ => ", reqMsg);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        console.log("AUV-RSP => ", rspMsg);
        if (!this.msgService.isValidHeader(rspMsg, MSGTYPE.AUV_RSP, reqMsg.header.endpointId)) {
          cb(null); return;
        }

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              cb(rspMsg); break;

            case (1): // reject-other
              alert("Unknown warning");
              cb(null); break;

            case (2): // reject-unallocated user sequence number
              alert("Unallocated user sequence number");
              cb(null); break;

            case (3): // reject-incorrect number of signed-in completions
              alert("Incorrect number of signed-in completions");
              cb(null); break;

            case (4): // reject-unauthorized user sequence number
              alert("Not an administrator. Login again");
              this.SGO({ nsc: this.storageService.get('userInfo').nsc }, ()=>{
                cb(null);
              });
              break;
          }
        }
      });
  }
}
