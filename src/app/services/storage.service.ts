import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-store';
import { ClearType } from 'ngx-store/src/config';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private sessionStorageService: SessionStorageService
  ) { }

  set(key: string, value: any){
    this.sessionStorageService.set(key, value);
  }
  
  get(key: string): any{
    return this.sessionStorageService.get(key);
  }

  remove(key: string){
    this.sessionStorageService.remove(key);
  }
  
  clear(cleartype: ClearType): any{
    this.sessionStorageService.clear(cleartype);
  }

/***********************************/

  //-- State machine management --//
  fnSetCurrentState(enteredState: number) {
    this.set('state', enteredState);
  }

  fnGetCurrentState(): number {
    return Number(this.get('state'));
  }

  //-- USN managment --//
  fnGetUserSequenceNumber(): number {
    return Number(this.get('userInfo').usn);
  }

  //-- NSC management --//
  fnGetNumberOfSignedInCompletions(): number {
    return Number(this.get('userInfo').nsc);
  }
}
