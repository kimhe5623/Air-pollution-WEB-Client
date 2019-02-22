import { Component, OnInit, ViewChild } from '@angular/core';
import { DataManagementService } from 'src/app/services/data-management.service';
import { DataMonitoringService } from 'src/app/services/httpRequest/data-monitoring.service';
import { FormControl, Validators } from '@angular/forms';
import { } from 'googlemaps';
import { StorageService } from 'src/app/services/storage.service';
import { HEADER } from 'src/app/header';
declare var google;


@Component({
  selector: 'app-air-sensor-history-contents',
  templateUrl: './air-sensor-history-contents.component.html',
  styleUrls: ['./air-sensor-history-contents.component.css']
})
export class AirSensorHistoryContentsComponent implements OnInit {
  /**
   * Map
   */
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  autocomplete: google.maps.places.Autocomplete;

  markers: any = {};
  clickedMarkerMacAddress: string = '';
  circle: google.maps.Circle = null;

  currentLocation: any;
  currentAddress: any;
  infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow();

  /** Icon urls */
  aqi_icon = {
    good: 'assets/map/marker/good.svg',
    moderate: 'assets/map/marker/moderate.svg',
    unhealthy_for_sensitive_groups: 'assets/map/marker/unhealthy-for-sensitive-groups.svg',
    unhealthy: 'assets/map/marker/unhealthy.svg',
    very_unhealthy: 'assets/map/marker/very-unhealthy.svg',
    hazardous: 'assets/map/marker/hazardous.svg',
  };
  /** Label color */
  aqi_label_color = {
    good: '#000000',
    moderate: '#000000',
    unhealthy_for_sensitive_groups: '#000000',
    unhealthy: '#ffffff',
    very_unhealthy: '#ffffff',
    hazardous: '#ffffff',
  };
  /** Circle color */
  aqi_circle_color = {
    good: '#33e081',
    moderate: '#ebe841',
    unhealthy_for_sensitive_groups: '#f19040',
    unhealthy: '#ec4545',
    very_unhealthy: '#b046e0',
    hazardous: '#6b132e',
    undefined: '#000000',
  };

  /**
   * Nations
   */
  nations0: any = {};
  nations1: any = {};
  nations2: any = {};
  nations3: any = {};

  /**
   * Options 
   */
  enteredNationCode: string = '';
  enteredAddress: string = '';

  /**
   * Slider
   */
  timeSliderMax: number = 0;
  timeSliderMin: number = 0;
  timeSliderThumbLabel: boolean = true;
  timeSliderValue: number = 0;
  previousTimeSliderValue: number = 0;
  timeListForSelectedMarker: any = [];
  selectedTime: string = '';

  /**
   * Forms
   */
  startDate: FormControl;
  endDate: FormControl;

  timeSet: any = { hour: [], min: [] };

  enteredStartHour: number;
  enteredStartMin: number;
  enteredStartMode: number; // 0 or 12
  enteredEndHour: number;
  enteredEndMin: number;
  enteredEndMode: number; // 0 or 12
  isIncorrectTimeSelection: boolean;

  /**
   * Data
   */

  havRspAirdata: any = [];
  // [
  //   {
  //     wmac: '',
  //     lat: 0,
  //     lng: 0,
  //     commonDataTierTuple: ["", ""]
  //   }
  //    ...
  // ]

  parsedAirdata: any = {};
  // {
  //   'aabbccddeeff': {
  //     wmac: '',
  //     lat: 0,
  //     lng: 0,
  //     timeList: [],
  //     airdataBasedTmsp: {},
  //     airdataByTmsp: []
  //   }
  //    ...
  // }

  selectedAirdata: any = {};
  //   {
  //     timestamp: 0,
  //     temperature: 0,
  //     CO: 0,
  //     O3: 0,
  //     NO2: 0,
  //     SO2: 0,
  //     PM25: 0,
  //     PM10: 0,
  //     AQI_CO: 0,
  //     AQI_O3: 0,
  //     AQI_NO2: 0,
  //     AQI_SO2: 0,
  //     AQI_PM25: 0,
  //     AQI_PM10: 0,
  //   }

  amChartData: any = [
    {
      timestamp: 0,
      temperature: 0,
      CO: 0,
      O3: 0,
      NO2: 0,
      SO2: 0,
      PM25: 0,
      PM10: 0,
      AQI_CO: 0,
      AQI_O3: 0,
      AQI_NO2: 0,
      AQI_SO2: 0,
      AQI_PM25: 0,
      AQI_PM10: 0,
    }
  ];

  /**
   * Key check
   */
  removedKeys: any = [];
  newKeys: any = [];
  existedKeys: any = [];


  /**----*/
  isSearched: boolean = false;
  dataStatus: number = 0; // 0: noData or failed, 1: Loading data is ongoing, 2: data is completely loaded
  isShrToHav: boolean = false;
  isMarkerClicked: boolean = false;


  constructor(
    public dataService: DataManagementService,
    private dmService: DataMonitoringService,
    private storageService: StorageService
  ) {
    this.startDate = new FormControl(new Date().toISOString(), [Validators.required]);
    this.endDate = new FormControl(new Date().toISOString(), [Validators.required]);
  }

  ngOnInit() {
    this.nations0 = HEADER.NATIONS[0]
    this.nations1 = HEADER.NATIONS[1];
    this.nations2 = HEADER.NATIONS[2];
    this.nations3 = HEADER.NATIONS[3];

    this.timeSet.min.push(0);
    for (var i = 0; i < 12; i++) {
      this.timeSet.hour.push(i + 1);
      this.timeSet.min.push(i + 1);
    }
    for (var i = 12; i < 59; i++) {
      this.timeSet.min.push(i + 1);
    }

    this.enteredStartHour = 12;
    this.enteredStartMin = 0;
    this.enteredStartMode = 0; // 0 or 12
    this.enteredEndHour = 11;
    this.enteredEndMin = 59;
    this.enteredEndMode = 12; // 0 or 12

    if (this.storageService.get('shrToHav')) {

      this.isShrToHav = true;
      this.storageService.remove('shrToHav');
    }
  }

  // Functions list //


  /**
   * When the search button is clicked,
   */
  clickSearch() {
    this.isSearched = true;
    this.isMarkerClicked = false;
    this.dataStatus = 1; // 1: Loading data is ongoing 
    
    var payload = {
      nsc: Number(this.storageService.fnGetNumberOfSignedInCompletions()),
      ownershipCode: "1",
      sTs: Math.floor(new Date(this.startDate.value).setHours(this.hourCalc(this.enteredStartHour, this.enteredStartMode), this.enteredStartMin) / 1000),
      eTs: Math.floor(new Date(this.endDate.value).setHours(this.hourCalc(this.enteredEndHour, this.enteredEndMode), this.enteredEndMin) / 1000),
      // Number of HAV Fragments Required for Retransmission, (if it is 0, =>) List of Unsuccessful HAV Fragment Sequence Numbers
      nat: "Q30",
      state: "Q99",
      city: "Q16552",
    }

    this.dmService.fnHav(payload, (result) => {
      if (result == null) {
        this.dataStatus = 0;  // 0: noData or failed
        return;
      }

      else if (result.payload.historicalAirQualityDataListEncodings.length != 0) {
        this.dataStatus = 2;  // 2: data is completely loaded
        this.havRspAirdata = result.payload.historicalAirQualityDataListEncodings;
        console.log('havRspAirdata => ', this.havRspAirdata);
        this.mapInit();
      }
      else {
        this.dataStatus = 0;  // 0: noData or failed
      }

    });
  }

  hourCalc(hour: number, mode: number): number { // mode: 0 -> AM / 12 -> PM
    var result: number = 0;

    // If AM,
    if (mode == 0) {
      if (hour == 12) result = 0;
      else result = hour;
    }
    // If PM,
    else if (mode == 12) {
      if (hour == 12) result = hour;
      else result = hour + 12;
    }

    return result;
  }



  /**
   * When the time slider is changed,
   */
  timeSliderChanged() {
    this.circle.setMap(null);
    console.log('Slider is Changed! => ', this.timeSliderValue);
    this.selectedTime = this.dataService.formattingDate(new Date(Number(this.timeListForSelectedMarker[this.timeSliderValue])));
    // Set currently selected air data
    this.selectedAirdata = this.parsedAirdata[this.clickedMarkerMacAddress]['airdataByTmsp'][this.timeListForSelectedMarker[this.timeSliderValue]];
    console.log('timeSliderChanged: selectedAirdata => ', this.selectedAirdata);

    this.changeMarkerBasedInAqi(this.clickedMarkerMacAddress);

  }


  /**
   * When the chart is clicked
   */
  chartClicked(index: number) {
    console.log('Chart is clicked! => ', index);
    this.timeSliderValue = index;
    // Set currently selected air data
    this.selectedAirdata = this.parsedAirdata[this.clickedMarkerMacAddress]['airdataByTmsp'][this.timeListForSelectedMarker[this.timeSliderValue]];
    console.log('chartClicked: selectedAirdata => ', this.selectedAirdata);

    this.selectedTime = this.dataService.formattingDate(new Date(Number(this.timeListForSelectedMarker[this.timeSliderValue])));
  }


  /**
   * Map initialization
   */
  mapInit() {

    // Set google map options
    var mapProp = {
      center: new google.maps.LatLng(
        Number(this.havRspAirdata[0].lat),
        Number(this.havRspAirdata[0].lng)
      ),
      zoom: 10,
      draggableCursor: '',
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Get current Address for setting the place holder of nation field
    this.dataService.getCurrentAddress((currentAddress) => {

      console.log('currentAddress => ', currentAddress);

      for (var i = 0; i < currentAddress.address.results[5].address_components.length; i++) {
        if (currentAddress.address.results[5].address_components[i].types[0] == 'country') {
          var currentNationShortname = currentAddress.address.results[5].address_components[i].short_name;
        }
      }

      console.log('nations3 => ', this.nations3[currentNationShortname]);
      if (this.nations3[currentNationShortname] != null) {
        this.enteredNationCode = this.nations3[currentNationShortname][1];
      }

      // initialize the google maps
      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
      this.autocomplete = new google.maps.places.Autocomplete(document.getElementById(`autocomplete`), {
        types: [`address`],
        componentRestrictions: [currentNationShortname],
      });


      this.addAllSensorMarkers();
    });
  }


  //==============================================================
  /**
   * @param data: array data
   * add markers when the maps is initialized.
   */
  addAllSensorMarkers() {
    for (var i = 0; i < this.havRspAirdata.length; i++) {


      var key = this.havRspAirdata[i].wmac;

      var marker = new google.maps.Marker({
        map: this.map,
        position: { lat: Number(this.havRspAirdata[i].lat), lng: Number(this.havRspAirdata[i].lng) },

        icon: {
          anchor: new google.maps.Point(40, 40),
          labelOrigin: new google.maps.Point(40, 40),
          origin: new google.maps.Point(0, 0),
          scaledSize: new google.maps.Size(80, 80),
          url: 'assets/map/marker/sensor.svg'
        },

        label: {
          color: '#ffffff',
          fontSize: '20px',
          fontWeight: '400',
          text: "~:" + key.substring(10),
        }
      });

      this.markers[key] = marker;

      this.addMarkerClickedEvent(key);
    }
    console.log('Markers => ', this.markers);
  }

  turningMarkerToOriginal(key) {
    this.markers[key].setIcon({
      anchor: new google.maps.Point(40, 40),
      labelOrigin: new google.maps.Point(40, 40),
      origin: new google.maps.Point(0, 0),
      scaledSize: new google.maps.Size(80, 80),
      url: 'assets/map/marker/sensor.svg'
    });
    this.markers[key].setLabel(
      {
        color: '#ffffff',
        fontSize: '20px',
        fontWeight: '400',
        text: "~:" + key.substring(10),
      }
    );
  }



  /**
   * Add each marker click listener with infowindows
   */
  addMarkerClickedEvent(key) {

    google.maps.event.clearListeners(this.markers[key], 'click');

    google.maps.event.addListener(this.markers[key], 'click', () => {
      console.log('click!!! => ', this.markers[key]);
      this.isMarkerClicked = true;

      // If it is not the first marker click,
      if (this.clickedMarkerMacAddress != '') {
        this.turningMarkerToOriginal(this.clickedMarkerMacAddress);
      }

      // Update clicked Marker MAC Address
      this.clickedMarkerMacAddress = key;

      // If there is no parsed data yet,
      if (!this.parsedAirdata[key]) {

        // Figure out what it is
        var clickedMarkerMacAddressIndex = 0;
        for (var i = 0; i < this.havRspAirdata.length; i++) {
          if (key == this.havRspAirdata[i].wmac) {
            clickedMarkerMacAddressIndex = i;
          }
        }

        // And parse it
        this.parsedAirdata[key] = this.dataService.clickedHistoricalAirDataParsing(this.havRspAirdata[clickedMarkerMacAddressIndex]);
      }

      // Set values for amChart
      this.amChartData = this.parsedAirdata[key]['airdataArray'];
      console.log('amChartData => ', this.amChartData);

      // Set some values about the time slider
      this.timeListForSelectedMarker = this.parsedAirdata[key].timeList;
      // console.log('timeList => ', this.timeListForSelectedMarker)
      this.timeSliderMin = 0;
      this.timeSliderMax = this.timeListForSelectedMarker.length - 1;
      this.timeSliderValue = this.timeSliderMax;
      this.selectedTime = this.dataService.formattingDate(new Date(Number(this.timeListForSelectedMarker[this.timeSliderValue])));

      // Set currently selected air data
      this.selectedAirdata = this.parsedAirdata[this.clickedMarkerMacAddress]['airdataByTmsp'][this.timeListForSelectedMarker[this.timeSliderValue]];
      console.log('marker Clicked: selectedAirdata => ', this.selectedAirdata);


      // If there is previous circle,
      if (this.circle != null) {
        // Remove it
        this.removeCircle();
      }

      // And make a new circle for AQI
      this.createCircle(key);

      // Also, change the marker which is clicked to show AQI data
      this.changeMarkerBasedInAqi(key);

      // And Set the infowindow
      this.infoWindow.close(); // Close previously opened infowindow
      this.infoWindow.setContent(`<strong>Clicked</strong>`);
      this.infoWindow.open(this.map, this.markers[key]);
    });

    google.maps.event.addListener(this.infoWindow, 'closeclick', () => {

      this.turningMarkerToOriginal(this.clickedMarkerMacAddress);
      this.removeCircle();
      this.circle = null;

      this.isMarkerClicked = false;
      this.clickedMarkerMacAddress = '';
      this.timeListForSelectedMarker = [];

      this.map.setZoom(10);
    });

  }


  createCircle(key) {
    var latlng = { lat: this.parsedAirdata[key]['lat'], lng: this.parsedAirdata[key]['lng'] };
    var aqiAvg: number = this.aqiAvg(this.parsedAirdata[key]['airdataByTmsp'][this.timeListForSelectedMarker[this.timeSliderValue]]);

    this.circle = new google.maps.Circle({
      strokeColor: this.getAqiCircleColor(aqiAvg),
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: this.getAqiCircleColor(aqiAvg),
      fillOpacity: 0.35,
      map: this.map,
      center: latlng,
      radius: 500
    });
  }

  updateCircle(key) {
    var latlng = { lat: this.parsedAirdata[key]['lat'], lng: this.parsedAirdata[key]['lng'] };
    var aqiAvg: number = this.aqiAvg(this.parsedAirdata[key]['airdataByTmsp'][this.timeListForSelectedMarker[this.timeSliderValue]]);

    this.circle.setOptions({
      strokeColor: this.getAqiCircleColor(aqiAvg),
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: this.getAqiCircleColor(aqiAvg),
      fillOpacity: 0.35,
      map: this.map,
      center: latlng,
      radius: 500
    });
  }

  removeCircle() {
    this.circle.setMap(null);
  }

  changeMarkerBasedInAqi(key) {

    var latlng = { lat: this.parsedAirdata[key]['lat'], lng: this.parsedAirdata[key]['lng'] };
    var aqiAvg: number = this.aqiAvg(this.parsedAirdata[key]['airdataByTmsp'][this.timeListForSelectedMarker[this.timeSliderValue]]);
    console.log('aqiAvg => ', aqiAvg, this.parsedAirdata[key]);

    this.markers[key].setIcon({
      anchor: new google.maps.Point(20, 20),
      labelOrigin: new google.maps.Point(20, 20),
      origin: new google.maps.Point(0, 0),
      scaledSize: new google.maps.Size(40, 40),
      url: this.getAqiIcon(aqiAvg)
    });

    this.markers[key].setLabel(
      {
        color: this.getAqiFontColor(aqiAvg),
        fontSize: '13px',
        fontWeight: '400',
        text: aqiAvg.toString(),
      }
    );

    this.updateCircle(key);

    this.map.setCenter(latlng);
    this.map.setZoom(13);


    this.addMarkerClickedEvent(key);
  }


  /** Date Select: Time */
  timeSelectChanged() {
    if (this.startDate.value == this.endDate.value) {
      var startHour = this.enteredStartHour + this.enteredStartMode;
      var endHour = this.enteredEndHour + this.enteredEndMode;

      if (startHour > endHour) {
        this.isIncorrectTimeSelection = true;
      }
      else if (startHour == endHour) {
        if (this.enteredStartMin < this.enteredEndMin) {
          this.isIncorrectTimeSelection = true;
        }
      }
      else {
        this.isIncorrectTimeSelection = false;
      }
    }
  }



  /**
   * get AQI average
   * @param eachData: each data
   */
  aqiAvg(eachData: any): number {
    if (eachData != null) {
      var sum: number = eachData.AQI_CO + eachData.AQI_NO2 + eachData.AQI_O3
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

  /**
* get AQI circle color
* @param aqi : Air quality index
*/
  getAqiCircleColor(aqi: number): string {
    if (aqi >= 0 && aqi <= 50) {
      return this.aqi_circle_color.good;
    }
    else if (aqi >= 51 && aqi <= 100) {
      return this.aqi_circle_color.moderate;
    }
    else if (aqi >= 101 && aqi <= 150) {
      return this.aqi_circle_color.unhealthy_for_sensitive_groups;
    }
    else if (aqi >= 151 && aqi <= 200) {
      return this.aqi_circle_color.unhealthy;
    }
    else if (aqi >= 201 && aqi <= 300) {
      return this.aqi_circle_color.very_unhealthy;
    }
    else if (aqi >= 301 && aqi <= 500) {
      return this.aqi_circle_color.hazardous;
    }
    else {
      return this.aqi_circle_color.undefined;
    }
  }
}
