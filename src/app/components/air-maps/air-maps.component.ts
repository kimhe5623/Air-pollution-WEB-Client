import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from 'googlemaps';
import { DataManagementService } from '../../services/data-management.service';
import { SANITIZER } from '@angular/core/src/render3/interfaces/view';
declare var google;

@Component({
  selector: 'app-air-maps',
  templateUrl: './air-maps.component.html',
  styleUrls: ['./air-maps.component.css']
})

export class AirMapsComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  locationLimits: any;
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

  constructor(
    private dataService: DataManagementService
  ) { }

  ngOnInit() {
    this.dataService.getCurrentLatlng((location) => {

      /**
       * Data sets
       */
      this.locationLimits = {
        maxLatitude: location.latitude + 3,
        maxLongitude: location.longitude + 3,
        minLatitude: location.latitude - 3,
        minLongitude: location.longitude - 3,
      }

      for (var i = 0; i < 30; i++) {
        this.data.push({
          mac: '12:F2:D3:92:2C:FF',
          activation: 2,
          latitude: Math.random() * this.locationLimits.maxLatitude + this.locationLimits.minLatitude,
          longitude: Math.random() * this.locationLimits.maxLongitude + this.locationLimits.minLongitude,
          timestamp: new Date(1538097883026),
          temperature: 30,
          CO: Math.random() * 500 + 0,
          O3: Math.random() * 500 + 0,
          NO2: Math.random() * 500 + 0,
          SO2: Math.random() * 500 + 0,
          PM25: Math.random() * 500 + 0,
          PM10: Math.random() * 500 + 0,
          AQI_CO: Math.floor(Math.random() * 500 + 0),
          AQI_O3: Math.floor(Math.random() * 500 + 0),
          AQI_NO2: Math.floor(Math.random() * 500 + 0),
          AQI_SO2: Math.floor(Math.random() * 500 + 0),
          AQI_PM25: Math.floor(Math.random() * 500 + 0),
          AQI_PM10: Math.floor(Math.random() * 500 + 0),
        });
      }

      //console.log('data=>', this.data);

      /**
       * Google maps
       */
      var mapProp = {
        center: new google.maps.LatLng(Number(location.latitude), Number(location.longitude)),
        zoom: 4,
        draggableCursor: '',
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);


      /**
       * Marker
       */
      for (var i = 0; i < this.data.length; i++) {

        var marker = new google.maps.Marker({
          map: this.map,
          position: { lat: this.data[i].latitude, lng: this.data[i].longitude },
          
          icon: {
            anchor: new google.maps.Point(20, 45),
            labelOrigin: new google.maps.Point(20, 20),
            origin: new google.maps.Point(0, 0),
            scaledSize: new google.maps.Size(40, 45),
            url: this.getAqiIcon(this.aqiAvg(i))
          },
    
          label: {
            color: this.getAqiFontColor(this.aqiAvg(i)),
            fontSize: '13px',
            fontWeight: '400',
            text: this.aqiAvg(i).toString(),
          },

        });

      }

    });
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