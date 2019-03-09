import { Injectable } from '@angular/core';
import { HEADER } from 'src/app/header';
import { StorageService } from './storage.service';
import { AuthorizationService } from './authorization.service';

@Injectable({
  providedIn: 'root'
})
export class StateMachineManagementService {

  constructor(
    private storageService: StorageService,
    private authService: AuthorizationService
  ) { }

  /**
   * Used when it is needed to check if the currentState is correct or not
   * @param eid 
   * @param msgType 
   * @param timerType 
   */
  fnStateOfUsnCheck(rspMsgType: number): boolean {
    var currentState = this.storageService.fnGetCurrentState();
    var correctState: number;
    var isCorrect: boolean;

    if(currentState == NaN){
      currentState = 0;
    }

    switch(rspMsgType){

      // DEPENDS ON IF IT IS LOGGED IN OR NOT: IDLE STATE OR USN INFORMED STATE
      case (HEADER.MSGTYPE.RAV_RSP):
      case (HEADER.MSGTYPE.SHR_RSP):
        if(this.authService.isUserLoggedIn()){
          correctState = HEADER.STATE_SWP.USN_INFORMED_STATE;
          isCorrect = (currentState == HEADER.STATE_SWP.USN_INFORMED_STATE);
        }
        else {
          correctState = HEADER.STATE_SWP.IDLE_STATE;
          isCorrect = (currentState == HEADER.STATE_SWP.IDLE_STATE);
        }
        break;

      // USER DUPLICATE REQUESTED STATE
      case (HEADER.MSGTYPE.SGU_RSP):
        correctState = HEADER.STATE_SWP.USER_DUPLICATE_REQUESTED_STATE;
        isCorrect = (currentState == HEADER.STATE_SWP.USER_DUPLICATE_REQUESTED_STATE);
        break;

      // HALF USN ALLOCATED STATE
      case (HEADER.MSGTYPE.UVC_RSP):
        correctState = HEADER.STATE_SWP.HALF_USN_ALLOCATED_STATE;
        isCorrect = (currentState == HEADER.STATE_SWP.HALF_USN_ALLOCATED_STATE);
        break;

      // HALF IDLE STATE
      case (HEADER.MSGTYPE.SGO_ACK):
      case (HEADER.MSGTYPE.UDR_RSP):
        correctState = HEADER.STATE_SWP.HALF_IDLE_STATE
        isCorrect = (currentState == HEADER.STATE_SWP.HALF_IDLE_STATE);
        break;

      // USN INFORMED STATE
      case (HEADER.MSGTYPE.UPC_RSP): case (HEADER.MSGTYPE.AUV_RSP): case (HEADER.MSGTYPE.ASR_RSP): case (HEADER.MSGTYPE.ASD_RSP):
      case (HEADER.MSGTYPE.ASV_RSP): case (HEADER.MSGTYPE.SRG_RSP): case (HEADER.MSGTYPE.SAS_RSP): case (HEADER.MSGTYPE.SDD_RSP):
      case (HEADER.MSGTYPE.SLV_RSP): case (HEADER.MSGTYPE.RHV_RSP): case (HEADER.MSGTYPE.HHV_RSP): case (HEADER.MSGTYPE.KAS_RSP):
        correctState = HEADER.STATE_SWP.USN_INFORMED_STATE;
        isCorrect = (currentState == HEADER.STATE_SWP.USN_INFORMED_STATE);
        break;

      // HALF USN INFORMED STATE
      case (HEADER.MSGTYPE.SGI_RSP):
        correctState = HEADER.STATE_SWP.USN_INFORMED_STATE;
        isCorrect = (currentState == HEADER.STATE_SWP.HALF_USN_INFORMED_STATE);
        break;
      
      default:
        isCorrect = HEADER.RES_FAILD;
    }

    console.log('State check: current state => ', this.stateToString(currentState), '(', isCorrect, ')');
    console.log('It should be ', this.stateToString(correctState));
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

    // If reqMsg
    if (reqMsgType != 0 && timerType == null && rspMsgType == 0) {

      switch (reqMsgType) {

        /** CHANGE TO IDLE STATE */
        case (HEADER.MSGTYPE.FPU_REQ):
          currentState = HEADER.STATE_SWP.IDLE_STATE;
          break;

        /** CHANGE TO IDLE STATE OR USN INFORMED STATE DEPENDS ON IF IT IS LOGGED IN OR NOT */
        case (HEADER.MSGTYPE.SHR_REQ):
        case (HEADER.MSGTYPE.RAV_REQ):
          if (this.authService.isUserLoggedIn()) { // With an identified USN
            currentState = HEADER.STATE_SWP.USN_INFORMED_STATE;
          }
          else { // With an anonymous USN
            currentState = HEADER.STATE_SWP.IDLE_STATE;
          }
          break;

        /** CHANGE TO "USER ID DUPLICATE REQUESTED STATE" */
        case (HEADER.MSGTYPE.SGU_REQ):
          currentState = HEADER.STATE_SWP.USER_DUPLICATE_REQUESTED_STATE;
          break;

        /** CHANGE TO "HALF USN ALLOCATED STATE" */
        case (HEADER.MSGTYPE.UVC_REQ):
          currentState = HEADER.STATE_SWP.HALF_USN_ALLOCATED_STATE;
          break;

        /** CHANGE TO "HALF IDLE STATE" */
        case (HEADER.MSGTYPE.SGO_NOT):
        case (HEADER.MSGTYPE.UDR_REQ):
          currentState = HEADER.STATE_SWP.HALF_IDLE_STATE;
          break;

        /** CHANGE TO "USN INFORMED STATE" */
        case (HEADER.MSGTYPE.UPC_REQ): case (HEADER.MSGTYPE.AUV_REQ): case (HEADER.MSGTYPE.ASR_REQ): case (HEADER.MSGTYPE.ASD_REQ):
        case (HEADER.MSGTYPE.ASV_REQ): case (HEADER.MSGTYPE.SRG_REQ): case (HEADER.MSGTYPE.SAS_REQ): case (HEADER.MSGTYPE.SDD_REQ):
        case (HEADER.MSGTYPE.SLV_REQ): case (HEADER.MSGTYPE.RAV_RSP): case (HEADER.MSGTYPE.RHV_REQ): case (HEADER.MSGTYPE.HAV_REQ):
        case (HEADER.MSGTYPE.HHV_REQ): case (HEADER.MSGTYPE.KAS_REQ):
          currentState = HEADER.STATE_SWP.USN_INFORMED_STATE;
          break;

        /** CHANGE TO "HALF USN INFORMED STATE" */
        case (HEADER.MSGTYPE.SGI_REQ):
          currentState = HEADER.STATE_SWP.HALF_USN_INFORMED_STATE;
          break;

        default:
          currentState = 0;
          break;

      }

      //console.log('State change for reqMsg');

    }

    // If rspMsg //
    else if (reqMsgType == 0 && timerType == null && rspMsgType != 0) {

      switch (rspMsgType) {
        /** CHANGE TO "IDLE STATE" */
        case (HEADER.MSGTYPE.FPU_RSP):
        case (HEADER.MSGTYPE.SGO_ACK):
          currentState = HEADER.STATE_SWP.IDLE_STATE;
          break;

        /** CHANGE TO "IDLE STATE" OR "USN INFORMED STATE" DEPENDS ON IF IT IS LOGGED IN OR NOT */
        case (HEADER.MSGTYPE.SHR_RSP):
        case (HEADER.MSGTYPE.RAV_RSP):
          if (this.authService.isUserLoggedIn()) {  // With an identified USN

            if(resultCode == 2 || resultCode == 3)
              currentState = HEADER.STATE_SWP.IDLE_STATE;
            
            else
              currentState = HEADER.STATE_SWP.USN_INFORMED_STATE;

          }

          else // With an anonymous USN
            currentState = HEADER.STATE_SWP.IDLE_STATE;

          break;

        /** CHANGE TO "IDLE STATE"(REJECT) OR "USER ID DUPLICATE REQUESTED STATE"(OK) DEPENDS ON RESULT CODE */
        case (HEADER.MSGTYPE.SGU_RSP):
          if (resultCode == 0) // (OK code)
            currentState = HEADER.STATE_SWP.USER_DUPLICATE_REQUESTED_STATE;

          else  // (REJECT codes)
            currentState = HEADER.STATE_SWP.IDLE_STATE;

          break;

        /** CHANGE TO "IDLE STATE"(OK) OR "USER ID DUPLICATE REQUESTED STATE"(REJECT) DEPENDS ON RESULT CODE */
        case (HEADER.MSGTYPE.UVC_RSP):
          if (resultCode == 0) // (OK code)
            currentState = HEADER.STATE_SWP.IDLE_STATE;

          else  // (REJECT codes)
            currentState = HEADER.STATE_SWP.USER_DUPLICATE_REQUESTED_STATE;

          break;

        /** CHANGE TO "IDLE STATE"(REJECT) OR "USN INFORMED STATE"(OK) DEPENDS ON RESULT CODE */
        case (HEADER.MSGTYPE.SGI_RSP):
          if (resultCode == 0) // (OK code)
            currentState = HEADER.STATE_SWP.USN_INFORMED_STATE;

          else // (REJECT codes)
            currentState = HEADER.STATE_SWP.IDLE_STATE;

          break;

        /** CHANGE TO "IDLE STATE"(OK) OR "USN INFORMED STATE"(REJECT) DEPENDS ON RESULT CODE */
        case (HEADER.MSGTYPE.UDR_RSP):
          if (resultCode == 0) // (OK code)
            currentState = HEADER.STATE_SWP.IDLE_STATE;

          else // (REJECT codes)
            currentState = HEADER.STATE_SWP.USN_INFORMED_STATE;

          break;

        /** CHANGE TO "IDLE STATE"(UNALLOCATED USN: 2 or INCORRECT NSC: 3) OR "USN INFORMED STATE"(OTHERS) DEPENDS ON RESULT CODE */
        case (HEADER.MSGTYPE.UPC_RSP): case (HEADER.MSGTYPE.AUV_RSP): case (HEADER.MSGTYPE.ASR_RSP): case (HEADER.MSGTYPE.ASD_RSP):
        case (HEADER.MSGTYPE.ASV_RSP): case (HEADER.MSGTYPE.SRG_RSP): case (HEADER.MSGTYPE.SAS_RSP): case (HEADER.MSGTYPE.SDD_RSP):
        case (HEADER.MSGTYPE.SLV_RSP): case (HEADER.MSGTYPE.RHV_RSP): case (HEADER.MSGTYPE.HAV_RSP): case (HEADER.MSGTYPE.HHV_RSP):
        case (HEADER.MSGTYPE.KAS_RSP):

          if (resultCode == 2 || resultCode == 3) // (Unallocated USN or Incorrect NSC)
            currentState = HEADER.STATE_SWP.IDLE_STATE;

          else
            currentState = HEADER.STATE_SWP.USN_INFORMED_STATE;

          break;

        default:
          currentState = 0;
          break;

      }

      //console.log('State change for rspMsg');

    }

    // If timeout //
    else if (reqMsgType == 0 && timerType != null && rspMsgType == 0) {

      switch (timerType) {

        /** CHANGE TO "IDLE STATE" */
        case ('T401'): case('T403'): case('T406'): case('T416'): case ('T419'): case('T551'): case ('T553'):
          currentState = HEADER.STATE_SWP.IDLE_STATE;
          break;

        /** CHANGE TO "USN INFORMED STATE" */
        case ('T405'): case('T407'): case ('T408'): case ('T409'): case('T410'): case('T411'): case('T412'):
        case ('T413'): case ('T414'): case ('T415'): case ('T416'): case ('T417'): case ('T418'): case ('T419'):
        case ('T420'): case ('T421'): case ('T552'): case ('T553'): case ('T554'):
          currentState = HEADER.STATE_SWP.USN_INFORMED_STATE;
          break;

        default:
          currentState = 0;
          break;

      }

      //console.log('State change for Timeout');
    }

    else {
      currentState = 0;
    }

    //console.log('State was changed from ', this.stateToString(this.storageService.fnGetCurrentState()), ' to ', this.stateToString(currentState));
    this.storageService.fnSetCurrentState(currentState);
  }

  stateToString(currentState: number):string{
    var result = '';

    switch(currentState){
      case(HEADER.STATE_SWP.IDLE_STATE):
        result = 'Idle state';
        break;
      case(HEADER.STATE_SWP.USER_DUPLICATE_REQUESTED_STATE):
        result = 'User duplicate requested state';
        break;
      case(HEADER.STATE_SWP.HALF_USN_ALLOCATED_STATE):
        result = 'Half USN allocated state';
        break;
      case(HEADER.STATE_SWP.HALF_USN_INFORMED_STATE):
        result = "Half USN informed state";
        break;
      case(HEADER.STATE_SWP.USN_INFORMED_STATE):
        result = "USN informed state";
        break;
      case(HEADER.STATE_SWP.HALF_IDLE_STATE):
        result = "Half Idle state";
        break;
    }

    return result;
  }

}

export declare type timerType = 'T401' | 'T402' | 'T403' | 'T404' | 'T405' | 'T406' | 'T407' | 'T408' | 'T409' | 'T410' | 'T411' | 'T412' | 'T413' | 'T414' | 'T415' | 'T416' | 'T417' | 'T418' | 'T419' | 'T420' | 'T421' |
  'T551' | 'T552' | 'T553' | 'T554' | 'R404';