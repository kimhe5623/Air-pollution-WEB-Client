import { Injectable } from '@angular/core';
import { HEADER } from 'src/app/header';
import { StorageService } from './storage.service';
import { AuthorizationService } from './authorization.service';
import { DisplayMessageService } from './display-message.service';

@Injectable({
  providedIn: 'root'
})
export class StateMachineManagementService {

  constructor(
    private storageService: StorageService,
    private authService: AuthorizationService,
    private dispMsgService: DisplayMessageService
  ) { }

  /**
   * Used when it is needed to check if the currentState is correct or not
   * @param eid 
   * @param msgType 
   * @param timerType 
   */
  fnStateOfUsnCheck(msgType: number): boolean {
    var currentState = this.storageService.fnGetCurrentState();
    var correctState: number;
    var isCorrect: boolean;

    if (currentState == null) {
      currentState = 0;
      isCorrect = false;
    }
    else {

      // IDLE STATE
      if (msgType == HEADER.MSGTYPE.FPU_RSP) {
        correctState = HEADER.STATE_SWP.IDLE_STATE;
        isCorrect = (currentState == correctState);
      }

      // IDLE STATE OR USER DUPLICATE REQUESTED STATE
      else if (msgType == HEADER.MSGTYPE.SGU_REQ) {
        correctState = HEADER.STATE_SWP.IDLE_STATE;
        isCorrect = (currentState == correctState);

        if(!isCorrect) {
          correctState = HEADER.STATE_SWP.USER_DUPLICATE_REQUESTED_STATE;
          isCorrect = (currentState == correctState);
        }
      }

      // IDLE STATE, USER DUPLICATE REQUESTED STATE OR HALF USN ALLOCATED STATE
      else if (msgType == HEADER.MSGTYPE.SGI_REQ) {
        correctState = HEADER.STATE_SWP.IDLE_STATE;
        isCorrect = (currentState == correctState);

        if(!isCorrect) {
          correctState = HEADER.STATE_SWP.USER_DUPLICATE_REQUESTED_STATE;
          isCorrect = (currentState == correctState);

          if(!isCorrect) {
            correctState = HEADER.STATE_SWP.HALF_USN_ALLOCATED_STATE;
            isCorrect = (currentState == correctState);
          } 
        }
      }

      // IDLE STATE, USER DUPLICATE REQUESTED STATE, HAlF USN ALLOCATED STATE OR HALF USN INFORMED STATE
      else if (msgType == HEADER.MSGTYPE.FPU_REQ) {
        correctState = HEADER.STATE_SWP.IDLE_STATE;
        isCorrect = (currentState == correctState);

        if(!isCorrect) {
          correctState = HEADER.STATE_SWP.USER_DUPLICATE_REQUESTED_STATE;
          isCorrect = (currentState == correctState);

          if(!isCorrect) {
            correctState = HEADER.STATE_SWP.HALF_USN_ALLOCATED_STATE;
            isCorrect = (currentState == correctState);
            
            if(!isCorrect) {
              correctState = HEADER.STATE_SWP.HALF_USN_INFORMED_STATE;
              isCorrect = (currentState == correctState);
            }
          }
        }
      }

      

      // USN INFORMED STATE
      else if (msgType == HEADER.MSGTYPE.SGO_NOT || msgType == HEADER.MSGTYPE.UDR_REQ) {
        correctState = HEADER.STATE_SWP.USN_INFORMED_STATE;
        isCorrect = (currentState == correctState);
      }

      // DEPENDS ON IF IT IS LOGGED IN OR NOT: IDLE STATE OR USN INFORMED STATE
      else if (msgType == HEADER.MSGTYPE.RAV_RSP || msgType == HEADER.MSGTYPE.SHR_RSP) {

        if (this.authService.isUserLoggedIn()) {
          correctState = HEADER.STATE_SWP.USN_INFORMED_STATE;
          isCorrect = (currentState == correctState);
        }
        else {
          correctState = HEADER.STATE_SWP.IDLE_STATE;
          isCorrect = (currentState == correctState);
        }

      }

      // DEPENDS ON IF IT IS LOGGED IN OR NOT: USN INFORMED STATE OR OTHERS
      else if (msgType == HEADER.MSGTYPE.RAV_REQ || msgType == HEADER.MSGTYPE.SHR_REQ) {
        if (this.authService.isUserLoggedIn()) {
          correctState = HEADER.STATE_SWP.USN_INFORMED_STATE;
          isCorrect = (currentState == correctState);
        }
        else {
          correctState = HEADER.STATE_SWP.IDLE_STATE;
          isCorrect = (currentState == correctState);
  
          if(!isCorrect) {
            correctState = HEADER.STATE_SWP.USER_DUPLICATE_REQUESTED_STATE;
            isCorrect = (currentState == correctState);
  
            if(!isCorrect) {
              correctState = HEADER.STATE_SWP.HALF_USN_ALLOCATED_STATE;
              isCorrect = (currentState == correctState);
              
              if(!isCorrect) {
                correctState = HEADER.STATE_SWP.HALF_USN_INFORMED_STATE;
                isCorrect = (currentState == correctState);
              }
            }
          }
        }
      }

      // USER DUPLICATE REQUESTED STATE
      else if (msgType == HEADER.MSGTYPE.SGU_RSP) {
        correctState = HEADER.STATE_SWP.USER_DUPLICATE_REQUESTED_STATE;
        isCorrect = (currentState == correctState);
      }
      
      // USER DUPLICATE REQUESTED STATE OR HALF USN ALLOCATED STATE
      else if (msgType == HEADER.MSGTYPE.UVC_REQ) {
        correctState = HEADER.STATE_SWP.USER_DUPLICATE_REQUESTED_STATE;
        isCorrect = (currentState == correctState);

        if(!isCorrect) {
          correctState = HEADER.STATE_SWP.HALF_USN_ALLOCATED_STATE;
          isCorrect = (currentState == correctState)
        }
      }

      // HALF USN ALLOCATED STATE
      else if (msgType == HEADER.MSGTYPE.UVC_RSP) {
        correctState = HEADER.STATE_SWP.HALF_USN_ALLOCATED_STATE;
        isCorrect = (currentState == correctState);
      }
      // HALF IDLE STATE
      else if (msgType == HEADER.MSGTYPE.SGO_ACK || msgType == HEADER.MSGTYPE.UDR_RSP) {
        correctState = HEADER.STATE_SWP.HALF_IDLE_STATE
        isCorrect = (currentState == correctState);
      }
      // USN INFORMED STATE
      else if (msgType == HEADER.MSGTYPE.UPC_REQ || msgType == HEADER.MSGTYPE.AUV_REQ || msgType == HEADER.MSGTYPE.ASR_REQ
            || msgType == HEADER.MSGTYPE.UPC_RSP || msgType == HEADER.MSGTYPE.AUV_RSP || msgType == HEADER.MSGTYPE.ASR_RSP
            || msgType == HEADER.MSGTYPE.ASD_REQ || msgType == HEADER.MSGTYPE.ASV_REQ || msgType == HEADER.MSGTYPE.SRG_REQ
            || msgType == HEADER.MSGTYPE.ASD_RSP || msgType == HEADER.MSGTYPE.ASV_RSP || msgType == HEADER.MSGTYPE.SRG_RSP
            || msgType == HEADER.MSGTYPE.SAS_REQ || msgType == HEADER.MSGTYPE.SDD_REQ || msgType == HEADER.MSGTYPE.SLV_REQ
            || msgType == HEADER.MSGTYPE.SAS_RSP || msgType == HEADER.MSGTYPE.SDD_RSP || msgType == HEADER.MSGTYPE.SLV_RSP
            || msgType == HEADER.MSGTYPE.RHV_REQ || msgType == HEADER.MSGTYPE.HAV_REQ || msgType == HEADER.MSGTYPE.HHV_REQ
            || msgType == HEADER.MSGTYPE.RHV_RSP || msgType == HEADER.MSGTYPE.HAV_RSP || msgType == HEADER.MSGTYPE.HHV_RSP
            || msgType == HEADER.MSGTYPE.KAS_REQ
            || msgType == HEADER.MSGTYPE.KAS_RSP) {
        correctState = HEADER.STATE_SWP.USN_INFORMED_STATE;
        isCorrect = (currentState == correctState);
      }

      // HALF USN INFORMED STATE
      else if (msgType == HEADER.MSGTYPE.SGI_RSP) {
        correctState = HEADER.STATE_SWP.HALF_USN_INFORMED_STATE;
        isCorrect = (currentState == correctState);
      }
      else {
        isCorrect = HEADER.RES_FAILD;
      }
      
    }



    this.dispMsgService.printLog(['VRFY', 'HDR', 'STATE CHECK','currentState: ' + this.stateToString(currentState), isCorrect ? 'Available' : 'Unavailable', 'correctState: ' + this.stateToString(correctState)]);
    return isCorrect;
  }

  /**
   * Used when the currentState has to be changed
   * 
   * @param eid Endpoint Id. USN or TCI can be in there
   * @param reqMsgType  if the msgType is not for request, It is 0
   * @param timerType if the msgType is not for timerType, It is null
   * @param rspMsgType if the msgType is not for response, It is 0
   * @param resultCode it is only meaningful when the rspMsgType isn't 0
   */
  fnStateOfUsnTransitChange(reqMsgType: number, rspMsgType: number, resultCode: number, timerType: timerType) {
    var currentState = 0;

    var logState: Array<string> = ['', ''];

    // If reqMsg
    if (reqMsgType != 0 && timerType == null && rspMsgType == 0) {
      logState = ['SENT', 'MSG']

      /** CHANGE TO IDLE STATE */
      if (reqMsgType == HEADER.MSGTYPE.FPU_REQ) {
        currentState = HEADER.STATE_SWP.IDLE_STATE;
      }
      /** CHANGE TO IDLE STATE OR USN INFORMED STATE DEPENDS ON IF IT IS LOGGED IN OR NOT */
      else if (reqMsgType == HEADER.MSGTYPE.SHR_REQ || reqMsgType == HEADER.MSGTYPE.RAV_REQ) {
        if (this.authService.isUserLoggedIn()) { // With an identified USN
          currentState = HEADER.STATE_SWP.USN_INFORMED_STATE;
        }
        else { // With an anonymous USN
          currentState = HEADER.STATE_SWP.IDLE_STATE;
        }
      }
      /** CHANGE TO "USER ID DUPLICATE REQUESTED STATE" */
      else if (reqMsgType == HEADER.MSGTYPE.SGU_REQ) {
        currentState = HEADER.STATE_SWP.USER_DUPLICATE_REQUESTED_STATE;
      }
      /** CHANGE TO "HALF USN ALLOCATED STATE" */
      else if (reqMsgType == HEADER.MSGTYPE.UVC_REQ) {
        currentState = HEADER.STATE_SWP.HALF_USN_ALLOCATED_STATE;
      }
      /** CHANGE TO "HALF IDLE STATE" */
      else if (reqMsgType == HEADER.MSGTYPE.SGO_NOT || reqMsgType == HEADER.MSGTYPE.UDR_REQ) {
        currentState = HEADER.STATE_SWP.HALF_IDLE_STATE;
      }
      /** CHANGE TO "USN INFORMED STATE" */
      else if (reqMsgType == HEADER.MSGTYPE.UPC_REQ || reqMsgType == HEADER.MSGTYPE.AUV_REQ || reqMsgType == HEADER.MSGTYPE.ASR_REQ
        || reqMsgType == HEADER.MSGTYPE.ASD_REQ || reqMsgType == HEADER.MSGTYPE.ASV_REQ || reqMsgType == HEADER.MSGTYPE.SRG_REQ
        || reqMsgType == HEADER.MSGTYPE.SAS_REQ || reqMsgType == HEADER.MSGTYPE.SDD_REQ || reqMsgType == HEADER.MSGTYPE.SLV_REQ
        || reqMsgType == HEADER.MSGTYPE.RHV_REQ || reqMsgType == HEADER.MSGTYPE.HAV_REQ || reqMsgType == HEADER.MSGTYPE.HHV_REQ
        || reqMsgType == HEADER.MSGTYPE.KAS_REQ) {
        currentState = HEADER.STATE_SWP.USN_INFORMED_STATE;
      }
      /** CHANGE TO "HALF USN INFORMED STATE" */
      else if (reqMsgType == HEADER.MSGTYPE.SGI_REQ) {
        currentState = HEADER.STATE_SWP.HALF_USN_INFORMED_STATE;
      }
      else { }

    }

    // If rspMsg //
    else if (reqMsgType == 0 && timerType == null && rspMsgType != 0) {
      logState = ['UNPK', 'PYLD'];

      /** CHANGE TO "IDLE STATE" */
      if (rspMsgType == HEADER.MSGTYPE.FPU_RSP || rspMsgType == HEADER.MSGTYPE.SGO_ACK) {
        currentState = HEADER.STATE_SWP.IDLE_STATE;
      }
      /** CHANGE TO "IDLE STATE" OR "USN INFORMED STATE" DEPENDS ON IF IT IS LOGGED IN OR NOT */
      else if (rspMsgType == HEADER.MSGTYPE.SHR_RSP || rspMsgType == HEADER.MSGTYPE.RAV_RSP) {
        if (this.authService.isUserLoggedIn()) {  // With an identified USN

          if (resultCode == 2 || resultCode == 3)
            currentState = HEADER.STATE_SWP.IDLE_STATE;
          else
            currentState = HEADER.STATE_SWP.USN_INFORMED_STATE;

        }
        else // With an anonymous USN
          currentState = HEADER.STATE_SWP.IDLE_STATE;
      }
      /** CHANGE TO "IDLE STATE"(REJECT) OR "USER ID DUPLICATE REQUESTED STATE"(OK) DEPENDS ON RESULT CODE */
      else if (rspMsgType == HEADER.MSGTYPE.SGU_RSP) {
        if (resultCode == 0) // (OK code)
          currentState = HEADER.STATE_SWP.USER_DUPLICATE_REQUESTED_STATE;
        else  // (REJECT codes)
          currentState = HEADER.STATE_SWP.IDLE_STATE;
      }
      /** CHANGE TO "IDLE STATE"(OK) OR "USER ID DUPLICATE REQUESTED STATE"(REJECT) DEPENDS ON RESULT CODE */
      else if (rspMsgType == HEADER.MSGTYPE.UVC_RSP) {
        if (resultCode == 0) // (OK code)
          currentState = HEADER.STATE_SWP.IDLE_STATE;
        else  // (REJECT codes)
          currentState = HEADER.STATE_SWP.USER_DUPLICATE_REQUESTED_STATE;
      }
      /** CHANGE TO "IDLE STATE"(REJECT) OR "USN INFORMED STATE"(OK) DEPENDS ON RESULT CODE */
      else if (rspMsgType == HEADER.MSGTYPE.SGI_RSP) {
        if (resultCode == 0) // (OK code)
          currentState = HEADER.STATE_SWP.USN_INFORMED_STATE;
        else // (REJECT codes)
          currentState = HEADER.STATE_SWP.IDLE_STATE;
      }
      /** CHANGE TO "IDLE STATE"(OK) OR "USN INFORMED STATE"(REJECT) DEPENDS ON RESULT CODE */
      else if (rspMsgType == HEADER.MSGTYPE.UDR_RSP) {
        if (resultCode == 0) // (OK code)
          currentState = HEADER.STATE_SWP.IDLE_STATE;
        else // (REJECT codes)
          currentState = HEADER.STATE_SWP.USN_INFORMED_STATE;
      }
      /** CHANGE TO "IDLE STATE"(UNALLOCATED USN: 2 or INCORRECT NSC: 3) OR "USN INFORMED STATE"(OTHERS) DEPENDS ON RESULT CODE */
      else if (rspMsgType == HEADER.MSGTYPE.UPC_RSP || rspMsgType == HEADER.MSGTYPE.AUV_RSP || rspMsgType == HEADER.MSGTYPE.ASR_RSP
        || rspMsgType == HEADER.MSGTYPE.ASD_RSP || rspMsgType == HEADER.MSGTYPE.ASV_RSP || rspMsgType == HEADER.MSGTYPE.SRG_RSP
        || rspMsgType == HEADER.MSGTYPE.SAS_RSP || rspMsgType == HEADER.MSGTYPE.SDD_RSP || rspMsgType == HEADER.MSGTYPE.SLV_RSP
        || rspMsgType == HEADER.MSGTYPE.RHV_RSP || rspMsgType == HEADER.MSGTYPE.HAV_RSP || rspMsgType == HEADER.MSGTYPE.HHV_RSP
        || rspMsgType == HEADER.MSGTYPE.KAS_RSP) {
        if (resultCode == 2 || resultCode == 3) // (Unallocated USN or Incorrect NSC)
          currentState = HEADER.STATE_SWP.IDLE_STATE;
        else
          currentState = HEADER.STATE_SWP.USN_INFORMED_STATE;
      }
      else { }

    }

    // If timeout //
    else if (reqMsgType == 0 && timerType != null && rspMsgType == 0) {
      logState = ['TMOT', 'MSG']

      /** CHANGE TO "IDLE STATE" */
      if (timerType == 'T401' || timerType == 'T403' || timerType == 'T406' || timerType == 'T551') {
        currentState = HEADER.STATE_SWP.IDLE_STATE;
      }
      /** CHANGE TO "IDLE STATE" OR "USN INFORMED STATE" DEPENDS ON IF IT IS LOGGED IN OR NOT */
      else if (timerType == 'T416' || timerType == 'T419' || timerType == 'T553') {
        if (this.authService.isUserLoggedIn()) // With an identified USN
          currentState = HEADER.STATE_SWP.USN_INFORMED_STATE;
        else
          currentState = HEADER.STATE_SWP.IDLE_STATE;
      }
      /** CHANGE TO "USN INFORMED STATE" */
      else if (timerType == 'T405' || timerType == 'T407' || timerType == 'T408' || timerType == 'T409' || timerType == 'T410'
        || timerType == 'T411' || timerType == 'T412' || timerType == 'T413' || timerType == 'T414' || timerType == 'T415'
        || timerType == 'T417' || timerType == 'T418' || timerType == 'T420' || timerType == 'T421' || timerType == 'T552'
        || timerType == 'T554') {
        currentState = HEADER.STATE_SWP.USN_INFORMED_STATE;
      }
      else { }

    } 

    else { }

    this.dispMsgService.printLog([logState[0], logState[1], 'STATE CHANGE', 'resultCode: ' + resultCode, '(' + this.stateToString(this.storageService.fnGetCurrentState()) + ') -> (' + this.stateToString(currentState) + ')']);
    this.storageService.fnSetCurrentState(currentState);

  }

  stateToString(currentState: number): string {
    var result = '';

    switch (currentState) {
      case (HEADER.STATE_SWP.IDLE_STATE):
        result = 'Idle state';
        break;
      case (HEADER.STATE_SWP.USER_DUPLICATE_REQUESTED_STATE):
        result = 'User duplicate requested state';
        break;
      case (HEADER.STATE_SWP.HALF_USN_ALLOCATED_STATE):
        result = 'Half USN allocated state';
        break;
      case (HEADER.STATE_SWP.HALF_USN_INFORMED_STATE):
        result = "Half USN informed state";
        break;
      case (HEADER.STATE_SWP.USN_INFORMED_STATE):
        result = "USN informed state";
        break;
      case (HEADER.STATE_SWP.HALF_IDLE_STATE):
        result = "Half Idle state";
        break;
    }

    return result;
  }

}

export declare type timerType = 'T401' | 'T402' | 'T403' | 'T404' | 'T405' | 'T406' | 'T407' | 'T408' | 'T409' | 'T410' | 'T411' | 'T412' | 'T413' | 'T414' | 'T415' | 'T416' | 'T417' | 'T418' | 'T419' | 'T420' | 'T421' |
  'T551' | 'T552' | 'T553' | 'T554' | 'R404';