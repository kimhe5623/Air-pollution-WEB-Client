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
    this.startDate = new FormControl(null, [Validators.required]);
    this.endDate = new FormControl(null, [Validators.required]);
  }

  ngOnInit() {
    this.nations0 = HEADER.NATIONS[0]
    this.nations1 = HEADER.NATIONS[1];
    this.nations2 = HEADER.NATIONS[2];
    this.nations3 = HEADER.NATIONS[3];

    /** Time selection values set */
    this.timeSet.hour.push(12);
    for (var i = 0; i < 11; i++) {
      this.timeSet.hour.push(i + 1);
      this.timeSet.min.push(i + 1);
    }
    for (var i = 11; i < 59; i++) {
      this.timeSet.min.push(i + 1);
    }
    this.timeSet.min.push(0);

    if (this.storageService.get('shrToHav')) {
      this.isShrToHav = true;
      var startD: Date = new Date(Number(this.storageService.get('shrToHav').startTmsp) * 1000);
      var endD: Date = new Date(Number(this.storageService.get('shrToHav').endTmsp) * 1000);

      this.startDate.setValue(startD);
      this.endDate.setValue(endD);

      this.enteredStartMin = startD.getMinutes();

      var modeHour: any = this.dataService.hourCalcToAmPm(startD.getHours());
      this.enteredStartHour = modeHour.hour;
      this.enteredStartMode = modeHour.mode; // 0 or 12

      this.enteredEndMin = endD.getMinutes();

      var modeHour = this.dataService.hourCalcToAmPm(endD.getHours());
      this.enteredEndHour = modeHour.hour;
      this.enteredEndMode = modeHour.mode; // 0 or 12

      this.clickSearch(this.storageService.get('shrToHav'));
      this.storageService.remove('shrToHav');
    }
    else {
      this.startDate.setValue(new Date());
      this.endDate.setValue(new Date());

      this.enteredStartHour = 12;
      this.enteredStartMin = 0;
      this.enteredStartMode = 0; // 0 or 12
      this.enteredEndHour = 11;
      this.enteredEndMin = 59;
      this.enteredEndMode = 12; // 0 or 12
    }
  }

  // Functions list //

  /**
   * When the search button is clicked,
   */
  clickSearch(shrToHavData?: any) {
    this.isSearched = true;
    this.isMarkerClicked = false;
    this.dataStatus = 1; // 1: Loading data is ongoing 

    var startTmsp: number = 0;
    var endTmsp: number = 0;

    if (this.isShrToHav) {
      startTmsp = shrToHavData.startTmsp;
      endTmsp = shrToHavData.endTmsp;
    }
    else {
      startTmsp = Math.floor(new Date(this.startDate.value).setHours(this.dataService.hourCalcTo24(this.enteredStartHour, this.enteredStartMode), this.enteredStartMin) / 1000);
      endTmsp = Math.floor(new Date(this.endDate.value).setHours(this.dataService.hourCalcTo24(this.enteredEndHour, this.enteredEndMode), this.enteredEndMin) / 1000);
    }

    var payload = {
      nsc: Number(this.storageService.fnGetNumberOfSignedInCompletions()),
      ownershipCode: "1",
      sTs: startTmsp,
      eTs: endTmsp,
      // Number of HAV Fragments Required for Retransmission, (if it is 0, =>) List of Unsuccessful HAV Fragment Sequence Numbers
      nat: "Q30",
      state: "Q99",
      city: "Q16552",
    }

    this.dmService.fnHav(payload, (result) => {
      if (result == null) {
        this.dataStatus = 0;  // 0: failed
        return;
      }

      else if (result.payload.historicalAirQualityDataListEncodings.length != 0) {
        this.dataStatus = 2;  // 2: data is completely loaded
        this.havRspAirdata = result.payload.historicalAirQualityDataListEncodings;

        if (this.isShrToHav) {
          this.mapInit(shrToHavData);
        }
        else this.mapInit();

      }
      else {
        this.dataStatus = 0;  // 0: noData
      }

    });
  }

  /**
   * When the time slider is changed,
   */
  timeSliderChanged() {
    this.circle.setMap(null);
    this.selectedTime = this.dataService.formattingDate(new Date(Number(this.timeListForSelectedMarker[this.timeSliderValue])));
    // Set currently selected air data
    this.selectedAirdata = this.parsedAirdata[this.clickedMarkerMacAddress]['airdataByTmsp'][this.timeListForSelectedMarker[this.timeSliderValue]];

    this.changeMarkerBasedInAqi(this.clickedMarkerMacAddress);
  }


  /**
   * When the chart is clicked
   */
  chartClicked(index: number) {
    this.timeSliderValue = index;
    this.selectedAirdata = this.parsedAirdata[this.clickedMarkerMacAddress]['airdataByTmsp'][this.timeListForSelectedMarker[this.timeSliderValue]];
    this.selectedTime = this.dataService.formattingDate(new Date(Number(this.timeListForSelectedMarker[this.timeSliderValue])));
  }


  /**
   * Map initialization
   */
  mapInit(shrToHavData?: any) {

    var initLatlng: google.maps.LatLng;
    var initNationCode: string;
    var initZoom: number;

    if (this.isShrToHav) {
      initLatlng = new google.maps.LatLng(Number(shrToHavData.currentGeometry.location.lat), Number(shrToHavData.currentGeometry.location.lng));
      initNationCode = shrToHavData.currentGeometry.nation;
      initZoom = 13;

      this.enteredNationCode = initNationCode;
      this.enteredAddress = shrToHavData.currentGeometry.address;
    }
    else {
      initLatlng = new google.maps.LatLng(Number(this.havRspAirdata[0].lat), Number(this.havRspAirdata[0].lng));
      initZoom = 10;

      // Get current Address for setting the place holder of nation field
      this.dataService.getCurrentAddress((currentAddress) => {
        for (var i = 0; i < currentAddress.address.results[5].address_components.length; i++) {
          if (currentAddress.address.results[5].address_components[i].types[0] == 'country') {
            var currentNationShortname = currentAddress.address.results[5].address_components[i].short_name;
          }
        }
        if (this.nations3[currentNationShortname] != null) {
          this.enteredNationCode = this.nations3[currentNationShortname][1];
        }
        initNationCode = currentNationShortname;
      });
    }

    // Set google map options
    var mapProp = {
      center: initLatlng,
      zoom: initZoom,
      draggableCursor: '',
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // initialize the google maps
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.autocomplete = new google.maps.places.Autocomplete(document.getElementById(`autocomplete`), {
      types: [`address`],
      componentRestrictions: [initNationCode],
    });

    /**
 * Event Listener for Autocomplete
 */
    google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
      var place = this.autocomplete.getPlace();

      if (!place || !place.geometry) {
        alert("No details available for input: '" + place.name + "'");
        return;
      }

      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      }
      else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(13);
      }
    });

    this.addAllSensorMarkers();
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

      // Set some values about the time slider
      this.timeListForSelectedMarker = this.parsedAirdata[key].timeList;
      this.timeSliderMin = 0;
      this.timeSliderMax = this.timeListForSelectedMarker.length - 1;
      this.timeSliderValue = this.timeSliderMax;
      this.selectedTime = this.dataService.formattingDate(new Date(Number(this.timeListForSelectedMarker[this.timeSliderValue])));

      // Set currently selected air data
      this.selectedAirdata = this.parsedAirdata[this.clickedMarkerMacAddress]['airdataByTmsp'][this.timeListForSelectedMarker[this.timeSliderValue]];

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
    var aqiMax: number = this.aqiMax(this.parsedAirdata[key]['airdataByTmsp'][this.timeListForSelectedMarker[this.timeSliderValue]]);

    this.circle = new google.maps.Circle({
      strokeColor: this.getAqiCircleColor(aqiMax),
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: this.getAqiCircleColor(aqiMax),
      fillOpacity: 0.35,
      map: this.map,
      center: latlng,
      radius: 500
    });
  }

  updateCircle(key) {
    var latlng = { lat: this.parsedAirdata[key]['lat'], lng: this.parsedAirdata[key]['lng'] };
    var aqiMax: number = this.aqiMax(this.parsedAirdata[key]['airdataByTmsp'][this.timeListForSelectedMarker[this.timeSliderValue]]);

    this.circle.setOptions({
      strokeColor: this.getAqiCircleColor(aqiMax),
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: this.getAqiCircleColor(aqiMax),
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
    var aqiMax: number = this.aqiMax(this.parsedAirdata[key]['airdataByTmsp'][this.timeListForSelectedMarker[this.timeSliderValue]]);

    this.markers[key].setIcon({
      anchor: new google.maps.Point(20, 20),
      labelOrigin: new google.maps.Point(20, 20),
      origin: new google.maps.Point(0, 0),
      scaledSize: new google.maps.Size(40, 40),
      url: this.getAqiIcon(aqiMax)
    });
    this.markers[key].setLabel(
      {
        color: this.getAqiFontColor(aqiMax),
        fontSize: '13px',
        fontWeight: '400',
        text: aqiMax.toString(),
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
   * get Max AQI
   * @param eachData: each data
   */
  aqiMax(eachData: any): number {
    var max = 0;
    for (var key in eachData) {
      if(key.split('_')[0] == 'AQI'){
        if (max < eachData[key] && eachData[key] > -1 && eachData[key] < 501)
          max = eachData[key];
      }
    }
    return max;
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
