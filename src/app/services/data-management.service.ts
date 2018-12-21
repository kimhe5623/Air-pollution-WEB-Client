import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-store';
import { DataMonitoringService } from './httpRequest/data-monitoring.service';
import { DisplayErrorService } from './display-error.service';
import { HEADER } from 'src/app/header';

@Injectable({
  providedIn: 'root'
})
export class DataManagementService {

  constructor(
    private sessionStorageService: SessionStorageService,
    private dmService: DataMonitoringService,
    private dispErrService: DisplayErrorService,
  ) { }

  /** Verify administrator */
  fnVerifyAdministrator(): number{
    var isAdmin: number = HEADER.RES_FAILD;
    
    if(this.sessionStorageService.get('userInfo')){
      if(this.sessionStorageService.get('userInfo').usn < 1001){
        isAdmin = HEADER.RES_SUCCESS;
      }
      else {
        this.dispErrService.fnDispErrorString('UNAUTHORIZED_USER_SEQUENCE_NUMBER');
      }
    }

    return isAdmin;
  }

  /**
   * HTTP response data parsing: Realtime air data
   * @param rsp 
   */
  rspRealtimeAirDataParsing(rsp: any): any {

    //console.log("Entered realtime air rsp data => ", rsp);
    var result: any = [];

    for (var i = 0; i < rsp.length; i++) {
      var splitedData = rsp[i].split(',');
      //console.log('Splited! =>', splitedData);

      result.push({
        mac: splitedData[0],
        timestamp: new Date(Number(splitedData[1]) * 1000),
        latitude: Number(splitedData[2]),
        longitude: Number(splitedData[3]),
        temperature: Number(splitedData[4]),
        CO: Number(splitedData[5]),
        O3: Number(splitedData[6]),
        NO2: Number(splitedData[7]),
        SO2: Number(splitedData[8]),
        PM25: Number(splitedData[9]),
        PM10: Number(splitedData[10]),
        AQI_CO: Number(splitedData[11]),
        AQI_O3: Number(splitedData[12]),
        AQI_NO2: Number(splitedData[13]),
        AQI_SO2: Number(splitedData[14]),
        AQI_PM25: Number(splitedData[15]),
        AQI_PM10: Number(splitedData[16]),
      });
    }

    //console.log("Returned realtime parsed data => ", result)
    return result;
  }

  /**
   * HTTP response data parsing: Historical air data
   * @param rsp 
   */
  rspHistoricalAirDataParsing(rsp: any): any {

    //console.log("Entered historical air rsp data => ", rsp);
    var result: any = [];

    for (var i = 0; i < rsp.length; i++) {

      for(var j = 0; j < rsp[i].commonDataTierTuple.length; j++){

        var splitedData = rsp[i].commonDataTierTuple[j].split(',');
        //console.log('Splited! =>', splitedData);
  
        result.push({
          mac: rsp[i].wmac,
          timestamp: new Date(Number(splitedData[0]) * 1000),
          latitude: Number(rsp[i].lat),
          longitude: Number(rsp[i].lng),
          temperature: Number(splitedData[1]),
          CO: Number(splitedData[2]),
          O3: Number(splitedData[3]),
          NO2: Number(splitedData[4]),
          SO2: Number(splitedData[5]),
          PM25: Number(splitedData[6]),
          PM10: Number(splitedData[7]),
          AQI_CO: Number(splitedData[8]),
          AQI_O3: Number(splitedData[9]),
          AQI_NO2: Number(splitedData[10]),
          AQI_SO2: Number(splitedData[11]),
          AQI_PM25: Number(splitedData[12]),
          AQI_PM10: Number(splitedData[13]),
        });
      }
    }


    //console.log("Returned historical parsed data => ", result);
    return result;
  }

  /**
   * HTTP response data parsing: Historical heart data
   * @param rsp 
   */
  rspHistoricalHeartDataParsing(rsp: any): any {

    console.log("Entered historical heart rsp data => ", rsp);
    var result: any = [];

    for (var i = 0; i < rsp.length; i++) {
      var splitedData = rsp[i].split(',');
      //console.log('Splited! =>', splitedData);

      result.push({
        timestamp: new Date(Number(splitedData[0]) * 1000),
        latitude: Number(splitedData[1]),
        longitude: Number(splitedData[2]),
        heartrate: Number(splitedData[3]),
      });
    }

    console.log("Returned historical heart parsed data => ", result);
    return result;
  }

  /**
   * HTTP response data parsing: Sensor historical record view
   * @param rsp 
   */
  rspHistoricalSensorRecordDataParsing(rsp: any): any {

    console.log("Entered historical sensor record rsp data => ", rsp);
    var result: any = [];

    for (var i = 0; i < rsp.length; i++) {
      //console.log('Splited! =>', splitedData);

      result.push({
        mac: rsp[i][0],
        latitude: Number(rsp[i][1]),
        longitude: Number(rsp[i][2]),
        measurementStartDate: new Date(Number(rsp[i][3])*1000),
        measurementEndDate: new Date(Number(rsp[i][4])*1000),
        activation: Number(rsp[i][5]),
        status: this.sensorStatusParsing(Number(rsp[i][6])),
      });
    }

    console.log("Returned historical sensor record parsed data => ", result);
    return result;
  }

  /**
   * Change the input string format to the mac address format like 'AA:BB:CC:DD:EE:FF'
   * @param rsp ex> 'AABBCCDDEEFF'
   */
  rspToMacAddress(rsp: string): string {
    var mac: string = "";
    for (var i = 0; i < rsp.length / 2; i++) {
      mac += rsp.substr(i * 2, 2);

      if (i != rsp.length / 2 - 1)
        mac += ':';
    }
    return mac;
  }

  /**
   * Change the input string format to the reqMsg's format like 'AABBCCDDEEFF'
   * @param mac ex> 'AA:BB:CC:DD:EE:FF'
   */
  macAddressToReq(mac: string): string {
    return mac.split(':').join('');
  }

  sensorStatusParsing(status: number): any {
    return {
      temp: Math.floor((status / Math.pow(2, 0))) % 2, // bit1
      co: Math.floor((status / Math.pow(2, 1))) % 2, // bit2
      o3: Math.floor((status / Math.pow(2, 2))) % 2, // bit3
      no2: Math.floor((status / Math.pow(2, 3))) % 2,  // bit4
      so2: Math.floor((status / Math.pow(2, 4))) % 2,  // bit5
      pm25: Math.floor((status / Math.pow(2, 5))) % 2, // bit6
      pm10: Math.floor((status / Math.pow(2, 6))) % 2, // bit7
      gps: Math.floor((status / Math.pow(2, 7))) % 2,  // bit8
    };
  }

  /**
   * Check if its value exists
   */
  checkValueExist(value: any, array: any): boolean {
    var isExist: boolean = false;

    for (var i = 0; i < array.length; i++) {
      if (value === array[i]) isExist = true;
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

    var result: string = parsedDate[0] + '/' + parsedDate[1] + '/' + parsedDate[2] + ' '
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
    var Dev: any = {};
    var minDevKey: string = '';
    var minDevVal: number = 0;

    // calculate average
    for (var key in data) {
      num_of_data++;
      avg += data[key];
    }
    avg = avg / num_of_data;

    // calculate deviation
    for (var key in data) {
      Dev[key] = (data[key] - avg) * (data[key] - avg);
    }

    minDevKey = key;
    minDevVal = data[minDevKey];
    // return minimum deviation key and value
    for (var key in data) {
      if (minDevVal > data[key]) {
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
        ownershipCode: "1",
        sTs: Math.floor(new Date(new Date(currentTime.getTime()).setDate(currentTime.getDate() - 2)).getTime() / 1000),
        eTs: Math.floor(currentTime.getTime() / 1000),
        // nat: currentAddress.address.results[0].address_components[7].short_name,
        // state: currentAddress.address.results[0].address_components[6].short_name,
        // city: currentAddress.address.results[0].address_components[4].short_name
        nat: "Q30",
        state: "Q99",
        city: "Q16552",
      }

      this.dmService.HAV(payload, (result) => {

        // callback
        if (result != null && result.payload.historicalAirQualityDataListEncodings.length != 0) {
          /** Finding the nearest sensor */
          var tlv: any = this.rspHistoricalAirDataParsing(result.payload.historicalAirQualityDataListEncodings);
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
