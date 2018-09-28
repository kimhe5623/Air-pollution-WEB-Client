import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-store';
import { DataMonitoringService } from './httpRequest/data-monitoring.service';

@Injectable({
  providedIn: 'root'
})
export class DataManagementService {

  constructor(
    private sessionStorageService: SessionStorageService,
    private dmService: DataMonitoringService
  ) { }


  /**
   * Temperature unit change function
   */
  CelsiusToFahr(C_data: any): any {
    var result: any = [];
    for (var i = 0; i < C_data.length; i++) {
      result.push(Math.floor(C_data[i] * 1.8 + 32));
    }
    return result;
  }

  FahrenheitToCels(F_data: any): any {
    var result: any = [];
    for (var i = 0; i < F_data.length; i++) {
      result.push(Math.floor((F_data[i] - 50) * 0.5556));
    }
    return result;
  }

  /**
   * get current latlng function
   */
  getCurrentLatlng(cb) {
    navigator.geolocation.getCurrentPosition((currentLatlng) => {
      cb({ latitude: currentLatlng.coords.latitude, longitude: currentLatlng.coords.longitude });
    })
  }

  /**
   * get current address function
   */
  getCurrentAddress(cb) {
    this.getCurrentLatlng((currentLatlng) => {
      this.dmService.latlngToAddress(currentLatlng.latitude, currentLatlng.longitude, (address) => {
        cb({ currentLatlng: currentLatlng, address: address });
      })
    })
  }

  /**
   * return minimum index and value
   */
  min(array: any): any {
    var min = array[0];
    var minidx = 0;
    for (var i = 1; i < array.length; i++) {
      if (min > array[i]) {
        min = array[i];
        minidx = i;
      }
    }
    return { idx: minidx, value: min };
  }

  /**
   * calculate distance function
   */
  getDistances(from: any, to: any): any {
    var result: any = [];

    for (var i = 0; i < to.length; i++) {
      var lat = from.latitude - to[i].latitude;
      var lng = from.longitude = to[i].longitude;
      result.push(lat * lat + lng * lng);
    }
    return result;
  }

  /**
   * get the nearest sensor's data
   */
  getNearestSensorData(cb) {
    this.getCurrentAddress((currentAddress) => {

      var currentTime: Date = new Date();
      var payload = {
        nsc: this.sessionStorageService.get('userInfo').nsc,
        ownership: 1,
        start_tsp: new Date(new Date(currentTime.getTime()).setDate(currentTime.getDate() - 2)),
        end_tsp: currentTime,
        num_of_retransmission: 0,
        list_of_unsuccessful_serials: [],
        TLV: {
          nation: currentAddress.address.results[0].address_components[7].short_name,
          state: currentAddress.address.results[0].address_components[6].short_name,
          city: currentAddress.address.results[0].address_components[4].short_name
        }
      }

      this.dmService.HAV(payload, (result) => {
        if (result.resultCode != 0) cb(null);
        else if (result.resultCode) {
          /** Finding the nearest sensor */
          var distances: any = this.getDistances(currentAddress.currentLatlng, result.payload.tlv);
          var theNearestIdx: number = this.min(distances).idx;
        }
      })
    })
  }


}
