import { Injectable } from '@angular/core';
import { HEADER } from 'src/app/header';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(
    private storageService: StorageService
  ) { }

  isAdministor(usn?: number): boolean {
    if (usn == null) usn = this.storageService.fnGetUserSequenceNumber()
    
    if (usn == 1) return true;
    else return false;
  }

  isUserLoggedIn(): boolean {
    if(this.storageService.get('userInfo') != HEADER.NULL_VALUE)  return HEADER.RES_SUCCESS;
    else return HEADER.RES_FAILD;
  }

}
