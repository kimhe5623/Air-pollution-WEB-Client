import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayMessageService {

  constructor() { }

  fnDispErrorString(et: ErrorType) {
    switch (et) {
      case ('EMPTY_VALUE_INVALID'):
        alert('Internal error: Empty value invalid');
        break;

      case ('INVALID_FORMAT'):
        alert('Internal error: Invalid format');
        break;


      // Result code error
      case ('OTHER'):
        alert('Internal error: Unknown error');
        break;

      case ('CONFLICT_OF_TEMPORARY_CLIENT_ID'):
        alert('Internal error: Conflict of TCI');
        break;

      case ('DUPLICATE_OF_USER_ID'):
        alert('Internal error: Duplicate of userID');
        break;

      case ('NOT_EXIST_TEMPORARY_CLIENT_ID'):
        alert('Internal error: Not exist Temporary client ID');
        break;

      case ('INCORRECT_AUTHENTICATION_CODE'):
        alert('Internal error: Incorrect authentication code under the verification code');
        break;

      case ('NOT_EXIST_USER_ID'):
        alert('Internal error: Not exist user ID');
        break;

      case ('INCORRECT_CURRENT_USER_PASSWORD'):
        alert('Internal error: Incorrect password');
        break;

      case ('UNALLOCATED_USER_SEQUENCE_NUMBER'):
        alert('Internal error: Unallocated user sequence number');
        break;

      case ('INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS'):
        alert('Internal error: Incorrect number of signed-in completions');
        break;

      case ('INCORRECT_USER_INFORMATION'):
        alert('Internal error: Incorrect user information');
        break;

      case ('UNAUTHORIZED_USER_SEQUENCE_NUMBER'):
        alert('Internal error: Unauthorized user');
        break;

      case ('NOT_EXIST_WIFI_MAC_ADDRESS'):
        alert('Internal error: Not exist Wifi MAC address');
        break;

      case ('NOT_ASSOCIATED_WITH_USER_ID'):
        alert('Internal error: the requested WiFi MAC address is not an associated with user ID');
        break;

      case ('ALREADY_ASSOCIATED'):
        alert('Internal error: Already associated');
        break;
        
      case ('NOT_EXIST_SENSORS'):
        alert('Internal error: Not exist under the spatial-temporal search condition');
        break;

      case ('INCORRECT_HEADER'):
        alert('Internal error: Incorrect header');
        break;

      case ('TIMEOUT'):
        alert('Time out!');
        break;

      case ('CONNECTION_ERR'):
        alert('Unable to connect');
        break;

    }
  }

  fnDispSuccessString(st: SuccessType, data: string){
    switch(st){
      case('VERIFICATION_CODE_SENT'):
        alert('Verification code is successfully sent to ' + data);
        break;

      case('SIGNUP_COMPLETED'):
        alert('Sign up is successfully completed');
        break;

      case('SIGNIN_COMPLETED'):
        alert('Welcome!');
        break;
      
      case('PWCHANGE_COMPLETED'):
        alert('password is successfully changed');
        break;

      case('FPU_COMPLETED'):
        alert('Temporary password was sent to your email');
        break;
      
      case('UDR_COMPLETED'):
        alert("Successfully deregistered");
        break;
      
      case('SIGNOUT'):
        alert("Sign out!");
        break;
      
      case('SENSOR_REG_COMPLETED'):
        alert("Sensor "+ data +" is successfully registered");
        break;
      
      case('SENSOR_DELETE_COMPLETED'):
        alert('Successfully deregistered');
        break;

      case('SENSOR_ASSOCIATION_COMPLETED'):
        alert("Sensor "+ data +" is successfully associated");
    }
  }

  printLog(contents: Array<string>){
    var msg: string = "| SV | "
    for(var i=0; i<contents.length; i++){
      msg = msg.concat(contents[i]);
      

      if(i < contents.length-1){
        msg = msg.concat(' | ');
      }
    }
    console.log(msg);
  }

}

export declare type ErrorType = 'EMPTY_VALUE_INVALID' | 'INVALID_FORMAT'

  // Result code error
  | 'OTHER' | 'CONFLICT_OF_TEMPORARY_CLIENT_ID' | 'DUPLICATE_OF_USER_ID' | 'NOT_EXIST_TEMPORARY_CLIENT_ID' | 'INCORRECT_AUTHENTICATION_CODE' | 'NOT_EXIST_USER_ID' | 'INCORRECT_CURRENT_USER_PASSWORD' | 'UNALLOCATED_USER_SEQUENCE_NUMBER' | 'INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS' | 'INCORRECT_USER_INFORMATION' | 'UNAUTHORIZED_USER_SEQUENCE_NUMBER' | 'NOT_EXIST_WIFI_MAC_ADDRESS' | 'NOT_ASSOCIATED_WITH_USER_ID' | 'ALREADY_ASSOCIATED' | 'NOT_EXIST_SENSORS'
  
  | 'INCORRECT_HEADER' | 'TIMEOUT' | 'CONNECTION_ERR';

export declare type SuccessType = 'VERIFICATION_CODE_SENT' | 'SIGNUP_COMPLETED' | 'SIGNIN_COMPLETED' | 'PWCHANGE_COMPLETED' | 'FPU_COMPLETED' | 'UDR_COMPLETED' | 'SIGNOUT' | 'SENSOR_REG_COMPLETED' | 'SENSOR_DELETE_COMPLETED' | 'SENSOR_ASSOCIATION_COMPLETED';
