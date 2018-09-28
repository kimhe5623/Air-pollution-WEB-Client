import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { MsgService } from '../msg.service';
import { MSGTYPE, TIMER, RETRIVE, GOOGLE_MAP_API_KEY } from 'src/app/header';

@Injectable({
  providedIn: 'root'
})
export class DataMonitoringService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private msgService: MsgService) { }

  /**
   * Temperature unit change function
   */
  CelsiusToFahr(C_data: any): any{
    var result: any = [];
    for(var i=0; i<C_data.length; i++){
      result.push(Math.floor(C_data[i] * 1.8 + 32));
    }
    return result;
  }

  FahrenheitToCels(F_data: any): any{
    var result: any = [];
    for(var i=0; i<F_data.length; i++){
      result.push(Math.floor((F_data[i] - 50) * 0.5556));
    }
    return result;
  }

  /**
   * Latlng to address
   */
  latlngToAddress(lat:number, lng: number, cb): any{

    this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAP_API_KEY}`)
    .subscribe((result)=>{
      cb(result);
    });
  }


  /** RAV */
  /** RHV */
  /** HAV */
  /** SHR */
  /** HHV */
  /** KAS */
}
