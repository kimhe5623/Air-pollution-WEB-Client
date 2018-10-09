import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from 'googlemaps';
import { DataManagementService } from '../../services/data-management.service';
import { DataMonitoringService } from '../../services/httpRequest/data-monitoring.service';
import { timer } from 'rxjs/observable/timer';
declare var google;

@Component({
  selector: 'app-air-maps',
  templateUrl: './air-maps.component.html',
  styleUrls: ['./air-maps.component.css']
})

export class AirMapsComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  currentLocation: any;
  currentAddress: any;
  data: any = [];
  mc: MarkerClusterer;

  /** Icon urls */
  aqi_icon = {
    good: 'assets/map/marker/good.svg',
    moderate: 'assets/map/marker/moderate.svg',
    unhealthy_for_sensitive_groups: 'assets/map/marker/unhealthy-for-sensitive-groups.svg',
    unhealthy: 'assets/map/marker/unhealthy.svg',
    very_unhealthy: 'assets/map/marker/very-unhealthy.svg',
    hazardous: 'assets/map/marker/hazardous.svg',
  }
  /** Label color */
  aqi_label_color = {
    good: '#000000',
    moderate: '#000000',
    unhealthy_for_sensitive_groups: '#000000',
    unhealthy: '#ffffff',
    very_unhealthy: '#ffffff',
    hazardous: '#ffffff',
  }

  /** Cluster icon style */
  clusterIconStyle = [
    {
      url: 'assets/clusterer/circle-solid.svg',
      height: 26,
      width: 30,
      anchor: [4, 0],
      textColor: '#ff00ff',
      textSize: 10
    }, {
      url: 'assets/clusterer/circle-solid.svg',
      height: 35,
      width: 40,
      anchor: [8, 0],
      textColor: '#ff0000',
      textSize: 11
    }, {
      url: 'assets/clusterer/circle-solid.svg',
      width: 50,
      height: 44,
      anchor: [12, 0],
      textColor: '#ffffff',
      textSize: 12
    }
  ];

  constructor(
    private dataService: DataManagementService,
    private dmService: DataMonitoringService,
  ) { }

  ngOnInit() {
    this.dataService.getCurrentAddress((address) => {
      this.currentAddress = address.address;
      this.currentLocation = address.currentLatlng


      /**
       * Data sets
       */
      console.log(this.currentAddress);
      var payload = {
        nsc: 0x00,
        tlv: {
          zoomLevel: 4,
          nationCode: this.currentAddress.results[0].address_components[7].short_name,
          stateCode: this.currentAddress.results[0].address_components[6].short_name,
          cityCode: this.currentAddress.results[0].address_components[4].short_name
        }
      }
      this.dmService.RAV(payload, (result) => {
        if (result != null) {
          this.data = result.payload.tlv;
        }
        console.log('data=>', this.data);

        /**
         * Google maps initialization
         */
        var mapProp = {
          center: new google.maps.LatLng(Number(this.currentLocation.latitude), Number(this.currentLocation.longitude)),
          zoom: 4,
          draggableCursor: '',
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);


        /**
         * Marker
         */
        var markers = [];
        for (var i = 0; i < this.data.length; i++) {

          var marker = new google.maps.Marker({
            map: this.map,
            position: { lat: this.data[i].latitude, lng: this.data[i].longitude },

            icon: {
              anchor: new google.maps.Point(40, 40),
              labelOrigin: new google.maps.Point(40, 40),
              origin: new google.maps.Point(0, 0),
              scaledSize: new google.maps.Size(80, 80),
              url: this.getAqiIcon(this.aqiAvg(i))
            },

            label: {
              color: this.getAqiFontColor(this.aqiAvg(i)),
              fontSize: '13px',
              fontWeight: '400',
              text: this.aqiAvg(i).toString(),
            },

          });
          markers.push(marker);
        }

        /**
         * Clustering
         */
        /*var markerClusterer = new MarkerClusterer(this.map, markers, {
          maxZoom: 7,
          gridSize: 40,
          styles: this.clusterIconStyle,
        });*/
      });
    });

    // every 5 seconds
    const source = timer(0, 5000);
    //output: 0,1,2,3,4,5......
    const subscribe = source.subscribe(val => {

    });

  }

  /**
   * update markers
   */
  updateMarkers(){
    
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
   * @param idx : index number
   */
  aqiAvg(idx: number): number {
    var sum: number = this.data[idx].AQI_CO + this.data[idx].AQI_NO2 + this.data[idx].AQI_O3
      + this.data[idx].AQI_SO2 + this.data[idx].AQI_PM10 + this.data[idx].AQI_PM25;

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
  }
}