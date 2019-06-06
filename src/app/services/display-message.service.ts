import { Injectable } from '@angular/core';
import { NotiService } from './noti.service';

@Injectable({
  providedIn: 'root'
})
export class DisplayMessageService {

  constructor(
    private notiService: NotiService
  ) { }

  fnDispErrorString(et: ErrorType) {
    switch (et) {
      case ('EMPTY_VALUE_INVALID'):
        this.notiService.err('Empty value invalid');
        break;

      case ('INVALID_FORMAT'):
        this.notiService.err('Invalid format');
        break;


      // Result code error
      case ('OTHER'):
        this.notiService.err('Unknown error');
        break;

      case ('CONFLICT_OF_TEMPORARY_CLIENT_ID'):
        this.notiService.err('Conflict of TCI');
        break;

      case ('DUPLICATE_OF_USER_ID'):
        this.notiService.warn('Duplicate of userID');
        break;

      case ('NOT_EXIST_TEMPORARY_CLIENT_ID'):
        this.notiService.err('Not exist Temporary client ID');
        break;

      case ('INCORRECT_AUTHENTICATION_CODE'):
        this.notiService.err('Incorrect authentication code under the verification code', 600);
        break;

      case ('NOT_EXIST_USER_ID'):
        this.notiService.err('Not exist user ID');
        break;

      case ('INCORRECT_CURRENT_USER_PASSWORD'):
        this.notiService.err('Incorrect password');
        break;

      case ('UNALLOCATED_USER_SEQUENCE_NUMBER'):
        this.notiService.err('Unallocated user sequence number');
        break;

      case ('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS'):
        this.notiService.err('Incorrect number of signed-in completions');
        break;

      case ('INCORRECT_USER_INFORMATION'):
        this.notiService.err('Incorrect user information');
        break;

      case ('UNAUTHORIZED_USER_SEQUENCE_NUMBER'):
        this.notiService.err('Unauthorized user');
        break;

      case ('NOT_EXIST_WIFI_MAC_ADDRESS'):
        this.notiService.err('Not exist Wifi MAC address');
        break;

      case ('NOT_ASSOCIATED_WITH_USER_ID'):
        this.notiService.err('the requested WiFi MAC address is not an associated with user ID', 600);
        break;

      case ('ALREADY_ASSOCIATED_WITH_USN'):
        this.notiService.err('Already associated with the USN');
        break;

      case ('ALREADY_ASSOCIATED_WITH_OTHER'):
        this.notiService.err('Already associated with the other');
        break;
        
      case ('NOT_EXIST_SENSORS'):
        this.notiService.err('Not exist under the spatial-temporal search condition',600);
        break;

      case ('INCORRECT_HEADER'):
        this.notiService.err('Incorrect header');
        break;

      case ('TIMEOUT'):
        this.notiService.err('Time out!');
        break;

      case ('CONNECTION_ERR'):
        this.notiService.err('Unable to connect');
        break;

      case ('ALREADY_USED_PW'):
        this.notiService.err('Please choose another new password. It is already used.');

    }
  }

  fnDispSuccessString(st: SuccessType, data: string){
    switch(st){
      case('VERIFICATION_CODE_SENT'):
        this.notiService.succ('Verification code is successfully sent to ' + data, 600);
        break;

      case('SIGNUP_COMPLETED'):
        this.notiService.succ('Sign up is successfully completed');
        break;

      case('SIGNIN_COMPLETED'):
        this.notiService.succ('Welcome!');
        break;
      
      case('PWCHANGE_COMPLETED'):
        this.notiService.succ('password is successfully changed');
        break;

      case('FPU_COMPLETED'):
        this.notiService.succ('Temporary password was sent to your email');
        break;
      
      case('UDR_COMPLETED'):
        this.notiService.succ("Successfully deregistered");
        break;
      
      case('SIGNOUT'):
        this.notiService.succ("Sign out!");
        break;
      
      case('SENSOR_REG_COMPLETED'):
        this.notiService.succ("Sensor "+ data +" is successfully registered");
        break;
      
      case('SENSOR_DELETE_COMPLETED'):
        this.notiService.succ('Successfully deregistered');
        break;

      case('SENSOR_ASSOCIATION_COMPLETED'):
        this.notiService.succ("Sensor "+ data +" is successfully associated");
    }
  }

  printLog(contents: Array<string>){
    // var msg: string = "| SV | "
    // for(var i=0; i<contents.length; i++){
    //   msg = msg.concat(contents[i]);
      

    //   if(i < contents.length-1){
    //     msg = msg.concat(' | ');
    //   }
    // }
    // console.log(msg);
  }

}

export declare type ErrorType = 'EMPTY_VALUE_INVALID' | 'INVALID_FORMAT' | 'ALREADY_USED_PW'

  // Result code error
  | 'OTHER' | 'CONFLICT_OF_TEMPORARY_CLIENT_ID' | 'DUPLICATE_OF_USER_ID' | 'NOT_EXIST_TEMPORARY_CLIENT_ID' | 'INCORRECT_AUTHENTICATION_CODE' | 'NOT_EXIST_USER_ID' | 'INCORRECT_CURRENT_USER_PASSWORD' | 'UNALLOCATED_USER_SEQUENCE_NUMBER' | 'INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS' | 'INCORRECT_USER_INFORMATION' | 'UNAUTHORIZED_USER_SEQUENCE_NUMBER' | 'NOT_EXIST_WIFI_MAC_ADDRESS' | 'NOT_ASSOCIATED_WITH_USER_ID' 
  | 'ALREADY_ASSOCIATED_WITH_USN' | 'ALREADY_ASSOCIATED_WITH_OTHER' | 'NOT_EXIST_SENSORS' | 'INCORRECT_HEADER' | 'TIMEOUT' | 'CONNECTION_ERR';

export declare type SuccessType = 'VERIFICATION_CODE_SENT' | 'SIGNUP_COMPLETED' | 'SIGNIN_COMPLETED' | 'PWCHANGE_COMPLETED' | 'FPU_COMPLETED' | 'UDR_COMPLETED' | 'SIGNOUT' | 'SENSOR_REG_COMPLETED' | 'SENSOR_DELETE_COMPLETED' | 'SENSOR_ASSOCIATION_COMPLETED';
