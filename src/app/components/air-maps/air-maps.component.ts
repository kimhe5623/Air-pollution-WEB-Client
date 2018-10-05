import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from 'googlemaps';
import { DataManagementService } from '../../services/data-management.service';
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

  /** Colors */
  aqi_colors = {
    good: '#33e081',
    moderate: '#ebe841',
    unhealthy_for_sensitive_groups: '#f19040',
    unhealthy: '#ec4545',
    very_unhealthy: '#b046e0',
    hazardous: '#6b132e',
  }

  constructor(
    private dataService: DataManagementService
  ) { }

  ngOnInit() {
    this.dataService.getCurrentLatlng((location) => {

      this.locationLimits = {
        maxLatitude: location.latitude + 3,
        maxLongitude: location.longitude + 3,
        minLatitude: location.latitude - 3,
        minLongitude: location.longitude - 3,
      }

      for (var i = 0; i < 100; i++) {
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

      console.log('data=>', this.data);

      var mapProp = {
        center: new google.maps.LatLng(Number(location.latitude), Number(location.longitude)),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

      // Construct the circle for each value in citymap.
      // Note: We scale the area of the circle based on the population.
      for (var i = 0; i < this.data.length; i++) {
        // Add the circle for this city to the map.
        console.log('lat: ', this.data[i].latitude, 'lng: ', this.data[i].longitude);

        var cityCircle = new google.maps.Circle({
          strokeColor: '#fff',
          strokeOpacity: 0.8,
          strokeWeight: 0.2,
          fillColor: this.getAqiColor(this.aqiAvg(i)),
          fillOpacity: 0.3,
          map: this.map,
          center: { lat: this.data[i].latitude, lng: this.data[i].longitude },
          radius: 164768
        });

        console.log(cityCircle);
      }
    });

    google.maps.event.addDomListener()
  }

  aqiAvg(idx: number): number {
    var sum: number = this.data[idx].AQI_CO + this.data[idx].AQI_NO2 + this.data[idx].AQI_O3
      + this.data[idx].AQI_SO2 + this.data[idx].AQI_PM10 + this.data[idx].AQI_PM25;

    return sum / 6;
  }

  getAqiColor(aqi: number): string {
    if (aqi >= 0 && aqi <= 50) {
      return this.aqi_colors.good;
    }
    else if (aqi >= 51 && aqi <= 100) {
      return this.aqi_colors.moderate;
    }
    else if (aqi >= 101 && aqi <= 150) {
      return this.aqi_colors.unhealthy_for_sensitive_groups;
    }
    else if (aqi >= 151 && aqi <= 200) {
      return this.aqi_colors.unhealthy;
    }
    else if (aqi >= 201 && aqi <= 300) {
      return this.aqi_colors.very_unhealthy;
    }
    else if (aqi >= 301 && aqi <= 500) {
      return this.aqi_colors.hazardous;
    }
  }
}