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
  clear(cleartype: ClearType): any{
    this.sessionStorageService.clear(cleartype);
  }

  fnGetUserSequenceNumber(): number {
    return this.get('userInfo').usn;
  }

  fnGetNumberOfSignedInCompletions(): number {
    return this.get('userInfo').nsc;
  }
}
