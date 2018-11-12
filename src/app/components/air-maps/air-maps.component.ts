import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { } from 'googlemaps';
import { DataManagementService } from '../../services/data-management.service';
import { DataMonitoringService } from '../../services/httpRequest/data-monitoring.service';
import { StorageService } from 'src/app/services/storage.service';
import { TIMER } from 'src/app/header';
declare var google;

@Component({
  selector: 'app-air-maps',
  templateUrl: './air-maps.component.html',
  styleUrls: ['./air-maps.component.css']
})

export class AirMapsComponent implements OnInit, OnDestroy {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  markers: any = {};
  clickedMarker: string = '';

  currentLocation: any;
  currentAddress: any;
  data: any = [];
  infoWindow: google.maps.InfoWindow;

  /** Icon urls */
  aqi_icon = {
    good: 'assets/map/marker/good.svg',
    moderate: 'assets/map/marker/moderate.svg',
    unhealthy_for_sensitive_groups: 'assets/map/marker/unhealthy-for-sensitive-groups.svg',
    unhealthy: 'assets/map/marker/unhealthy.svg',
    very_unhealthy: 'assets/map/marker/very-unhealthy.svg',
    hazardous: 'assets/map/marker/hazardous.svg',
    undefined: 'assets/map/marker/undefined.svg'
  };
  /** Label color */
  aqi_label_color = {
    good: '#000000',
    moderate: '#000000',
    unhealthy_for_sensitive_groups: '#000000',
    unhealthy: '#ffffff',
    very_unhealthy: '#ffffff',
    hazardous: '#ffffff',
    undefined: '#000000',
  };


  private interval: any;
  private inInterval: boolean;


  constructor(
    private dataService: DataManagementService,
    private dmService: DataMonitoringService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.inInterval = true;
    //console.log("air-maps.component ngOnInit()");

    this.reqData((result) => {
      if (result != null) {
        this.data = result.data;

        this.mapInit(result);

      }

      /**
       * Update markers
       */

      // every 5 seconds
      this.interval = setInterval(() => {
        if (this.inInterval) {
          //console.log('air-maps.component subscribe');
          this.updateMarkers();
        }
      }, TIMER.T553);

    });
  }

  mapInit(result: any) {
    /**
     * Google maps initialization
     */
    if (this.data[result.firstKey] != null) {
      var mapProp = {
        center: new google.maps.LatLng(
          Number(this.data[result.firstKey].latitude),
          Number(this.data[result.firstKey].longitude)
        ),
        zoom: 15,
        draggableCursor: '',
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };


      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

      /**
       * Marker & Info window
       */
      this.markers = {};
      this.infoWindow = new google.maps.InfoWindow();
      this.addNewMarkers(this.data);
    }
    //console.log("mapInit() in air-maps.component, this.map => ", this.map);
  }

  ngOnDestroy() {
    //console.log('air-maps.component ngOnDestroy()');

    clearInterval(this.interval);
    this.inInterval = false;

  }

  // Function definition //

  /**
   * HTTP: Data request
   */
  reqData(cb) {
    this.dataService.getCurrentAddress((address) => {
      this.currentAddress = address.address;
      this.currentLocation = address.currentLatlng

      //Data sets
      var payload = {
        nsc: 0x00,
        provinceListEncodings: {
          // lat: this.currentLocation.latitude,
          // lng: this.currentLocation.longitude,
          lat: 32.88247, lng: -117.23484,
          commonNatTierTuple: {
            nat: "Q30",
            commonStateTierTuple: [
              {
                state: "Q99",
                commonCityTierTuple: ["Q16552", "Q65"]
              }
            ]
          }
        },
        keywordSearchListEncodings: {

        }
      }

      if (this.storageService.get('userInfo') != null) {
        payload.nsc = this.storageService.get('userInfo').nsc
      }

      this.dmService.RAV(payload, (result) => {
        //console.log('air-maps.component - RAV callback => ', result);
        if (result == null) cb(null);
        else if (result.payload.realtimeAirQualityDataList.length == 0) cb(null);

        else {
          var tlvData = this.dataService.rspRealtimeAirDataParsing(result.payload.realtimeAirQualityDataList);
          //console.log("RAV parsed tlvData =>", tlvData);
          var parsedData = { 'firstKey': '', 'data': {} };

          parsedData['firstKey'] = tlvData[0].mac;
          for (var i = 0; i < tlvData.length; i++) {
            parsedData['data'][tlvData[i].mac] = tlvData[i];
          }

          //console.log('parsed Data: ', parsedData);
          cb(parsedData);
        }
      });
    });
  }


  //==========================================================
  /**
   * @param data: array data
   * add markers
   */
  addNewMarkers(data: any) {

    this.data = [];
    //console.log('addNewMarkers', data);
    for (var key in data) {

      var marker = new google.maps.Marker({
        map: this.map,
        position: { lat: data[key].latitude, lng: data[key].longitude },

        icon: {
          anchor: new google.maps.Point(40, 40),
          labelOrigin: new google.maps.Point(40, 40),
          origin: new google.maps.Point(0, 0),
          scaledSize: new google.maps.Size(80, 80),
          url: this.getAqiIcon(this.aqiAvg(data[key]))
        },

        label: {
          color: this.getAqiFontColor(this.aqiAvg(data[key])),
          fontSize: '13px',
          fontWeight: '400',
          text: this.aqiAvg(data[key]).toString(),
        },

        data: data[key]

      });

      this.markers[key] = marker;

      this.addInfoWindow(key);
    }

  }

    /**
   * @param data: array data
   * add each marker
   */
  addNewMarker(eachData: any) {

      var marker = new google.maps.Marker({
        map: this.map,
        position: { lat: eachData.latitude, lng: eachData.longitude },

        icon: {
          anchor: new google.maps.Point(40, 40),
          labelOrigin: new google.maps.Point(40, 40),
          origin: new google.maps.Point(0, 0),
          scaledSize: new google.maps.Size(80, 80),
          url: this.getAqiIcon(this.aqiAvg(eachData))
        },

        label: {
          color: this.getAqiFontColor(this.aqiAvg(eachData)),
          fontSize: '13px',
          fontWeight: '400',
          text: this.aqiAvg(eachData).toString(),
        },

        data: eachData

      });

      this.markers[eachData.mac] = marker;

      this.addInfoWindow(eachData.mac);

  }

  /**
   * update markers
   */
  updateMarkers() {

    this.reqData((result) => {

      if (result != null) {
        if (this.map == null) {
          this.mapInit(result);
        }

        this.data = result.data;

        for(var key in this.data) {
          if(this.markers[key] == null) { // When old marker
            this.removeMarkerOnMap(key);
          }
        }

        // Marker update
        for (var key in this.markers) {

          var isChanged: boolean = false;

          // Comparing both of data
          //console.log("this.data => ", this.data, " this.markers => ", this.markers);
          for (var key_ in this.markers[key]['data']) {
            if (this.data[key] == null) { // When new marker is entered
              this.addNewMarkers
            }
            else if (this.data[key][key_] != this.markers[key]['data'][key_]) { // When marker value is changed,
              isChanged = true;
            }
          }


          if (isChanged) {

            this.markers[key].setIcon(
              {
                anchor: new google.maps.Point(40, 40),
                labelOrigin: new google.maps.Point(40, 40),
                origin: new google.maps.Point(0, 0),
                scaledSize: new google.maps.Size(80, 80),
                url: this.getAqiIcon(this.aqiAvg(this.data[key]))
              }
            );
            this.markers[key].setLabel(
              {
                color: this.getAqiFontColor(this.aqiAvg(this.data[key])),
                fontSize: '13px',
                fontWeight: '400',
                text: this.aqiAvg(this.data[key]).toString(),
              }
            );
            this.markers[key]['data'] = this.data[key];

            this.addInfoWindow(key);

            if (key === this.clickedMarker) {
              this.getInfoWindowContents(this.markers[key]['data'], (contents) => {
                this.infoWindow.close();
                this.infoWindow.setContent(contents);
                this.infoWindow.open(this.map, this.markers[this.clickedMarker]);
              });
            }

          }
        }
      }
    });
  }

  /**
   * add each listener for infoWindow
   */
  addInfoWindow(key) {

    google.maps.event.clearListeners(this.markers[key], 'click');

    google.maps.event.addListener(this.markers[key], 'click', () => {

      this.getInfoWindowContents(this.markers[key]['data'], (contents) => {
        this.infoWindow.close(); // Close previously opened infowindow
        this.infoWindow.setContent(contents);
        this.infoWindow.open(this.map, this.markers[key]);
        this.clickedMarker = this.markers[key]['data']['mac'];

        //console.log('click:', this.clickedMarker);

      });

    });

  }

  /**
   * @param eachData : each data
   * get infoWindow contents
   */
  getInfoWindowContents(eachData: any, cb) {
    this.dmService.latlngToAddress(eachData.latitude, eachData.longitude, (address) => {

      var locationName: string;
      if (address.status == 'OK') { locationName = `<strong>${address.results[0].formatted_address}</strong>`; }
      else { locationName = `<strong>lat</strong>&nbsp; ${eachData.latitude}<br><strong>lng</strong>&nbsp; ${eachData.longitude}`; }

      var contents = `
        <style>
        table, th, td {
          border: 0.1px solid #ababab;
        }
        th, td {
          padding: 7px;
        }
        </style>
        <h6 style="margin-bottom:5px; line-height: 30px">${locationName}</h6>
        <p>Wifi MAC address: ${this.dataService.rspToMacAddress(eachData.mac)}</p>
        <table>
            <tr>
                <th>CO</th>
                <th>O<sub>3</sub></th>
                <th>NO<sub>2</sub></th>
                <th>SO<sub>2</sub></th>
                <th>PM2.5</th>
                <th>PM10</th>
                <th>Temp</th>
            </tr>
            <tr>
                <td>${eachData.AQI_CO}</td>
                <td>${eachData.AQI_O3}</td>
                <td>${eachData.AQI_NO2}</td>
                <td>${eachData.AQI_SO2}</td>
                <td>${eachData.AQI_PM25}</td>
                <td>${eachData.AQI_PM10}</td>
                <td>${eachData.temperature}</td>
            </tr>
        </table> `;
      cb(contents);
    });
  }

  /**
   * @param marker : marker object
   *  remove marker on the map
   */
  removeMarkerOnMap(key) {
    this.markers[key].setMap(null);
  }

  /**
   * copy json data
   * @param data : data which you want to copy
   */
  JSON_copy(data: any): any {
    return JSON.parse(JSON.stringify(data));
  }

  /**
   * get AQI average
   * @param eachData: each data
   */
  aqiAvg(eachData: any): number {
    //console.log("In aqiAvg(), Entered data => ", eachData);
    var sum: number = 0;

    if (eachData != null) {
      sum = eachData.AQI_CO + eachData.AQI_NO2 + eachData.AQI_O3
        + eachData.AQI_SO2 + eachData.AQI_PM10 + eachData.AQI_PM25;

    }

    return Math.floor(sum / 6);
  }

  /**
   * get AQI Icon
   * @param aqi : Air quality index
   */
  getAqiIcon(aqi: number): string {
    if (aqi >= 0 && aqi <= 50) {
      return this.aqi_icon.good;
    }
    else if (aqi >= 51 && aqi <= 100) {
      return this.aqi_icon.moderate;
    }
    else if (aqi >= 101 && aqi <= 150) {
      return this.aqi_icon.unhealthy_for_sensitive_groups;
    }
    else if (aqi >= 151 && aqi <= 200) {
      return this.aqi_icon.unhealthy;
    }
    else if (aqi >= 201 && aqi <= 300) {
      return this.aqi_icon.very_unhealthy;
    }
    else if (aqi >= 301 && aqi <= 500) {
      return this.aqi_icon.hazardous;
    }
    else {
      return this.aqi_icon.undefined;
    }
  }

  /**
   * get AQI font color
   * @param aqi : Air quality index
   */
  getAqiFontColor(aqi: number): string {
    if (aqi >= 0 && aqi <= 50) {
      return this.aqi_label_color.good;
    }
    else if (aqi >= 51 && aqi <= 100) {
      return this.aqi_label_color.moderate;
    }
    else if (aqi >= 101 && aqi <= 150) {
      return this.aqi_label_color.unhealthy_for_sensitive_groups;
    }
    else if (aqi >= 151 && aqi <= 200) {
      return this.aqi_label_color.unhealthy;
    }
    else if (aqi >= 201 && aqi <= 300) {
      return this.aqi_label_color.very_unhealthy;
    }
    else if (aqi >= 301 && aqi <= 500) {
      return this.aqi_label_color.hazardous;
    }
    else {
      return this.aqi_label_color.undefined;
    }
  }
}