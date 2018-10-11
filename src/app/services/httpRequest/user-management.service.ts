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
  SGU(payload: any): boolean {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.SGU_REQ, null);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        if (!this.msgService.isValidHeader(rspMsg.header, MSGTYPE.SGU_RSP, reqMsg.header.endpointId)) return false;

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              this.router.navigate([`/signup-code`, rspMsg.header.endpointId, reqMsg.payload.userID, rspMsg.payload.verificationCode], { skipLocationChange: true });
              break;

            case (1): // reject-other
              alert('Unknown error');
              return false;

            case (2): // reject-conflict of tci
              alert('Conflict of TCI');
              return false;

            case (3): // reject-duplicate of user ID
              alert('Duplicate of userID');
              return false;
          }
        }
      });
    return true;
  }

  /** UVC */
  UVC(payload: any, EP: string): boolean {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.UVC_REQ, EP);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        if (!this.msgService.isValidHeader(rspMsg.header, MSGTYPE.UVC_RSP, reqMsg.header.endpointId)) return false;

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              alert('Signup is completely finished.');
              this.router.navigate([`/signin`]);
              break;

            case (1): // reject-other
              alert('Unknown error');
              this.router.navigate(['/']);
              return false;

            case (2): // reject-duplicate of user ID
              alert('Duplicate of user ID');
              this.router.navigate(['/signup']);
              return false;

            case (3): // reject-not exist Temporary Client ID
              alert('Not exist Temporary client ID');
              this.router.navigate(['/signup']);
              return false;

            case (4): // reject-incorrect authentication code under the verification code
              alert('Incorrect authentication code under the verification code');
              return false;
          }
        }
      })
    return true;
  }

  /** SGI */
  SGI(payload: any): boolean {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.SGI_REQ, null);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        if (!this.msgService.isValidHeader(rspMsg.header, MSGTYPE.SGI_RSP, reqMsg.header.endpointId)) return false;

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

              break;

            case (1): // reject-other
              alert('Unknown error');
              return false;

            case (2): // reject-conflict of Temporary Client ID
              alert('Conflict of Temporary Client ID');
              return false;

            case (3): // reject-not exist user ID
              alert('Not exist user ID');
              return false;

            case (4): // reject-incorrect current user password
              alert('Incorrect password');
              return false;
          }
        }
      })
    return true;
  }

  /** SGO */
  SGO(payload: any): boolean {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.SGO_NOT, this.storageService.get('userInfo').usn);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        switch (rspMsg.payload.resultCode) {
          case (0):
            console.log("Successfully signed out");
            break;

          case (1):
            console.log("Unknown warning");
            return false;

          case (2):
            console.log("Unallocated user sequence number");
            return false;

          case (3):
            console.log("Incorrect number of signed-in completions");
            return false;
        }
      })

    this.storageService.clear('all');
    return true;
  }

  /** UPC */
  UPC(payload: any): boolean {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.UPC_REQ, this.storageService.get('userInfo').usn);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        switch (rspMsg.payload.resultCode) {
          case (0):
            console.log("Successfully signed out");
            break;

          case (1):
            console.log("Unknown warning");
            return false;

          case (2):
            console.log("Unallocated user sequence number");
            return false;

          case (3):
            console.log("Incorrect number of signed-in completions");
            return false;
        }
      })

    return true;
  }

  /** FPU */
  FPU(payload: any): boolean {
    var reqMsg: any = this.msgService.packingMsg(payload, MSGTYPE.FPU_REQ, null);

    this.http.post(`/serverapi`, reqMsg)
      .subscribe((rspMsg: any) => {
        if (!this.msgService.isValidHeader(rspMsg.header, MSGTYPE.FPU_RSP, reqMsg.header.endpointId)) return false;

        else {
          switch (rspMsg.payload.resultCode) {
            case (0): // success
              alert('Temporary password was sended to your email')
              this.router.navigate([`/signin`]);
              break;

            case (1): // reject-other
              alert('Unknown error');
              return false;

            case (2): // reject-conflict of tci
              alert('Conflict of TCI');
              return false;

            case (3): // reject-incorrect user information
              alert('Incorrect user information');
              return false;

            case (4): // reject-not exist user ID
              alert('Not exist user ID');
              return false;
          }
        }
      });
    return true;
  }

  /** UDR */

  /** AUV */
}
