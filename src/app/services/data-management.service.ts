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
   * Check if its value exists
   */
  checkValueExist(value: any, array: any): boolean{
    var isExist: boolean = false;

    for(var i=0; i<array.length; i++){
      if(value === array[i]) isExist = true;
    }

    return isExist;
  }
  /** 
   * Date formatting
   */
  formattingDate(date: Date): string {
    var d = new Date(date);
    function pad2(n) { return n < 10 ? '0' + n : n }

    var parsedDate = [
      d.getFullYear().toString(),
      pad2(d.getMonth() + 1),
      pad2(d.getDate()),
      pad2(d.getHours()),
      pad2(d.getMinutes()),
      pad2(d.getSeconds())
    ];

    var result: string =  parsedDate[0] + '/' + parsedDate[1] + '/' + parsedDate[2] + ' '
      + parsedDate[3] + ':' + parsedDate[4] + ':' + parsedDate[5];

    return result;
  }

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
   * return minimum deviation key and value
   */
  minDev(key: string, data: any): any {
    var avg: number = 0;
    var num_of_data: number = 0;
    var Dev: any ={};
    var minDevKey: string = '';
    var minDevVal: number = 0;
    
    // calculate average
    for(var key in data){
      num_of_data++;
      avg += data[key];
    }
    avg = avg/num_of_data;

    // calculate deviation
    for(var key in data){
      Dev[key] = (data[key] - avg)*(data[key] - avg);
    }

    minDevKey = key;
    minDevVal = data[minDevKey];
    // return minimum deviation key and value
    for(var key in data){
      if(minDevVal > data[key]){
        minDevKey = key; minDevVal = data[key];
      }
    }

    return { key: minDevKey, value: minDevVal };
  }

  /**
   * calculate distance function
   */
  getDistances(from: any, to: any): any {
    var result: any = [];

    for (var i = 0; i < to.length; i++) {
      var lat = from.latitude - to[i].latitude;
      var lng = from.longitude - to[i].longitude;
      result.push(lat * lat + lng * lng);
    }
    return result;
  }

  /** 
   * get Chart data 
   */
  getChartData(data: any): any {
    console.log('getChartData Input: ', data);
    var chartData: any = {};

    for (var key in data[0]) {
      chartData[key] = { data: [], label: '' };
    }

    for (var i = 0; i < data.length; i++) {
      for (var key in data[i]) {
        chartData[key]['data'].push(data[i][key]);
        chartData[key]['label'] = key;
      }
    }

    console.log('getChartData Output: ', chartData);
    return chartData;
  }


  /**
   * extract specified number data
   */
  extractDataTo(num: number, data: any): any {
    if (num > data.length || num == 0) return null;
    else {
      var result: any = [];
      var numOfDistance: number = Math.floor(data.length / num);

      for (var i = numOfDistance - 1; i < data.length; i += numOfDistance) {
        if (num == 0) break;

        result.push(data[i]); num--;
      }
      return result;
    }
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
        tlv: {
          nation: currentAddress.address.results[0].address_components[7].short_name,
          state: currentAddress.address.results[0].address_components[6].short_name,
          city: currentAddress.address.results[0].address_components[4].short_name
        }
      }

      this.dmService.HAV(payload, (result) => {

        // callback
        if (result != null) {
          /** Finding the nearest sensor */
          var tlv: any = result.payload.tlv;
          var distances: any = this.getDistances(currentAddress.currentLatlng, tlv);
          var selectedMac: string = tlv[this.min(distances).idx]['mac'];
          var nearestSensorData: any = [];

          for (var i = 0; i < tlv.length; i++) {
            if (tlv[i]['mac'] == selectedMac)
              nearestSensorData.push(tlv[i]);
          }
          cb(nearestSensorData);
        }
        else cb(null);
      });
    });
  }

}
