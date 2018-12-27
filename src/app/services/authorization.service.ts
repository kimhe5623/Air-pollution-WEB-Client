import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor() { }

  isAdministor(usn: number): boolean {
    if (usn < 1000) return true;
    else return false;
  }

}
