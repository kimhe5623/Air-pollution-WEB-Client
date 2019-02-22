import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { } from 'googlemaps';
import { DataManagementService } from '../../services/data-management.service';
import { DataMonitoringService } from '../../services/httpRequest/data-monitoring.service';
import { StorageService } from 'src/app/services/storage.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { HEADER } from 'src/app/header';
import { AuthorizationService } from 'src/app/services/authorization.service';
declare var google;

@Component({
  selector: 'app-air-maps',
  templateUrl: './air-maps.component.html',
  styleUrls: ['./air-maps.component.css']
})

export class AirMapsComponent implements OnInit, OnDestroy {

  @ViewChild('gmap') gmapElement: any;

  map: google.maps.Map;
  autocomplete: google.maps.places.Autocomplete;

  markers: any = {};
  circles: any = {};

  isClicked: boolean = false;
  isLoggedIn: boolean = false;
  noSensor: boolean = true;

  clickedMarker: string = '';
  clickedLocation: string = '';
  clickedData: any = {};

  realtimeAirChartData: any = [];

  currentLocation: any;
  currentAddress: any;
  data: any = [];
  infoWindow: google.maps.InfoWindow;

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


  private interval: any;
  private inInterval: boolean;



  /** 
   * Chart variables
   */
  checkbox: any = {
    all: HEADER.RES_SUCCESS,
    temp: HEADER.RES_SUCCESS,
    co: HEADER.RES_SUCCESS,
    o3: HEADER.RES_SUCCESS,
    no2: HEADER.RES_SUCCESS,
    so2: HEADER.RES_SUCCESS,
    pm25: HEADER.RES_SUCCESS,
    pm10: HEADER.RES_SUCCESS
  }

  private chart: any = {}


  constructor(
    public dataService: DataManagementService,
    private dmService: DataMonitoringService,
    private storageService: StorageService,
    private authService: AuthorizationService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.inInterval = HEADER.RES_SUCCESS;
    this.isLoggedIn = this.authService.isUserLoggedIn();
    //console.log("air-maps.component ngOnInit()");

    this.nations0 = HEADER.NATIONS[0]
    this.nations1 = HEADER.NATIONS[1];
    this.nations2 = HEADER.NATIONS[2];
    this.nations3 = HEADER.NATIONS[3];

    this.reqData((result) => {
      if (result != HEADER.NULL_VALUE) {
        this.data = result.data;

        console.log('air-maps.component: data => ', this.data);

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
      }, HEADER.TIMER.T553);

    });
  }

  mapInit(result: any) {

    this.dataService.getCurrentAddress((currentAddress) => {

      for(var i=0; i<currentAddress.address.results[5].address_components.length; i++){
        if(currentAddress.address.results[5].address_components[i].types[0] == 'country'){
          var currentNationShortname = currentAddress.address.results[5].address_components[i].short_name;
        }
      }

      console.log('nations3 => ', this.nations3[currentNationShortname]);
      if (this.nations3[currentNationShortname] != null) {
        this.enteredNationCode = this.nations3[currentNationShortname][1];
      }
      console.log('currentAddress => ', currentAddress);
      /**
       * Google maps initialization
       */
      if (this.data[result.firstKey] != HEADER.NULL_VALUE) {
        var mapProp = {
          center: new google.maps.LatLng(
            currentAddress.currentLatlng.latitude,
            currentAddress.currentLatlng.longitude
          ),
          zoom: 17,
          draggableCursor: '',
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };


        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
        this.autocomplete = new google.maps.places.Autocomplete(document.getElementById(`autocomplete`), {
          types: [`address`],
          componentRestrictions: [currentNationShortname],
        });

        /**
         * Event Listener for Autocomplete
         */
        google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
          var place = this.autocomplete.getPlace();

          console.log('place changed event => ', place);

          if (!place || !place.geometry) {
            alert("No details available for input: '" + place.name + "'");
            return;
          }

          if (place.geometry.viewport) {
            this.map.fitBounds(place.geometry.viewport);
          }
          else {
            this.map.setCenter(place.geometry.location);
            this.map.setZoom(17);
          }
        });


        /**
         * Marker & Circle & Info window
         */
        this.markers = {};
        this.circles = {};
        this.infoWindow = new google.maps.InfoWindow();

        this.clickedMarker = result.firstKey;
        this.addNewMarkers(this.data);
        this.addparsedDataWithFirstkey();
        console.log('clicked Marker: mapInit() => ', this.clickedMarker);
      }
    });
    //console.log("mapInit() in air-maps.component, this.map => ", this.map);
  }

  ngOnDestroy() {
    //console.log('air-maps.component ngOnDestroy()');

    clearInterval(this.interval);
    this.inInterval = HEADER.RES_FAILD;

    // Chart
    this.chartDestroy();

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
          lat: this.currentLocation.latitude,
          lng: this.currentLocation.longitude,
          // lat: 32.88247, lng: -117.23484,
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

      if (this.authService.isUserLoggedIn()) {
        payload.nsc = this.storageService.fnGetNumberOfSignedInCompletions()
      }

      this.dmService.fnRav(payload, (result) => {
        //console.log('air-maps.component - RAV callback => ', result);
        if (result == HEADER.NULL_VALUE || result.payload.resultCode != HEADER.RESCODE_SWP_RAV.OK) { this.noSensor = true; cb(HEADER.NULL_VALUE); }
        else if (result.payload.realtimeAirQualityDataList.length == 0) { this.noSensor = true; cb(HEADER.NULL_VALUE); }

        else {
          this.noSensor = false;

          var parsedData = this.dataService.rspRealtimeAirDataParsing(result.payload.realtimeAirQualityDataList);

          // Add firstkey with parsedData //

          //console.log("parsed data =>", parsedData);
          var parsedDataWithFirstkey = { 'firstKey': '', 'data': {} };

          parsedDataWithFirstkey['firstKey'] = parsedData[0].mac;
          for (var i = 0; i < parsedData.length; i++) {
            parsedDataWithFirstkey['data'][parsedData[i].mac] = parsedData[i];
          }


          //console.log('parsed data with firstkey: ', parsedDataWithFirstkey);
          cb(parsedDataWithFirstkey);
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

    //console.log('addNewMarkers', data);
    for (var key in data) {

      var marker = new google.maps.Marker({
        map: this.map,
        position: { lat: data[key].latitude, lng: data[key].longitude },

        icon: {
          anchor: new google.maps.Point(20, 20),
          labelOrigin: new google.maps.Point(20, 20),
          origin: new google.maps.Point(0, 0),
          scaledSize: new google.maps.Size(40, 40),
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

      var circle = new google.maps.Circle({
        strokeColor: this.getAqiCircleColor(this.aqiAvg(data[key])),
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: this.getAqiCircleColor(this.aqiAvg(data[key])),
        fillOpacity: 0.35,
        map: this.map,
        center: { lat: data[key].latitude, lng: data[key].longitude },
        radius: 500
      });


      this.markers[key] = marker;
      this.circles[key] = circle;

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
        anchor: new google.maps.Point(20, 20),
        labelOrigin: new google.maps.Point(20, 20),
        origin: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(40, 40),
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

    var circle = new google.maps.Circle({
      strokeColor: this.getAqiCircleColor(this.aqiAvg(eachData)),
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: this.getAqiCircleColor(this.aqiAvg(eachData)),
      fillOpacity: 0.35,
      map: this.map,
      center: { lat: eachData.latitude, lng: eachData.longitude },
      radius: 500
    });

    this.markers[eachData.mac] = marker;
    this.circles[eachData.mac] = circle;

    this.addInfoWindow(eachData.mac);

  }

  /**
   * update markers
   */
  updateMarkers() {

    this.reqData((result) => {

      if (result != HEADER.NULL_VALUE) {

        if (this.map == HEADER.NULL_VALUE) {
          this.mapInit(result);
        }

        this.data = result.data;
        this.addparsedDataWithFirstkey();

        for (var key in this.data) {
          if (this.markers[key] == HEADER.NULL_VALUE) { // When old marker
            this.removeMarkerOnMap(key);
          }
        }

        // Marker update
        for (var key in this.markers) {

          var isChanged: boolean = HEADER.RES_FAILD;

          // Comparing both of data
          //console.log("this.data => ", this.data, " this.markers => ", this.markers);
          for (var key_ in this.markers[key]['data']) {
            if (this.data[key] == HEADER.NULL_VALUE) { // When new marker is entered
              this.addNewMarkers(key);
            }
            else if (this.data[key][key_] != this.markers[key]['data'][key_]) { // When marker value is changed,
              isChanged = HEADER.RES_SUCCESS;
            }
          }


          if (isChanged) {

            this.markers[key].setIcon(
              {
                anchor: new google.maps.Point(20, 20),
                labelOrigin: new google.maps.Point(20, 20),
                origin: new google.maps.Point(0, 0),
                scaledSize: new google.maps.Size(40, 40),
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
            this.circles[key].setOptions({
              strokeColor: this.getAqiCircleColor(this.aqiAvg(this.data[key])),
              strokeOpacity: 0.8,
              strokeWeight: 1,
              fillColor: this.getAqiCircleColor(this.aqiAvg(this.data[key])),
              fillOpacity: 0.35,
              map: this.map,
              center: { lat: this.data[key].latitude, lng: this.data[key].longitude },
              radius: 500
            });

            this.markers[key]['data'] = this.data[key];
            this.clickedData = this.markers[key]['data'];

            this.dmService.latlngToAddress(this.clickedData.latitude, this.clickedData.longitude, (address) => {

              if (address.status == 'OK') {
                this.clickedLocation = address.results[0].formatted_address;
                console.log('clickedLocation => ', this.clickedLocation);
              }
              else {
                this.clickedLocation = `latitude: ${this.clickedData.latitude} longitude: ${this.clickedData.longitude}`;
              }
            });

            this.addInfoWindow(key);

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

      this.clickedMarker = this.markers[key]['data']['mac'];
      this.markerClicked(key);
      console.log('air-maps.component click:', this.clickedMarker);

      this.markers[key]['data'] = this.data[key];
      this.clickedData = this.markers[key]['data'];

      this.dmService.latlngToAddress(this.clickedData.latitude, this.clickedData.longitude, (address) => {

        if (address.status == 'OK') {
          this.clickedLocation = address.results[0].formatted_address;
          console.log('clickedLocation => ', this.clickedLocation);
        }
        else {
          this.clickedLocation = `latitude: ${this.clickedData.latitude} longitude: ${this.clickedData.longitude}`;
        }
      });

      this.infoWindow.close(); // Close previously opened infowindow
      this.infoWindow.setContent(`<strong>Clicked</strong>`);
      this.infoWindow.open(this.map, this.markers[key]);
    });

    google.maps.event.addListener(this.infoWindow, 'closeclick', () => {
      this.isClicked = false;
    })

  }

  /**
   * @param marker : marker object
   *  remove marker on the map
   */
  removeMarkerOnMap(key) {
    this.markers[key].setMap(HEADER.NULL_VALUE);
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

    if (eachData != HEADER.NULL_VALUE) {
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

  /**
   * When the marker is clicked,
   */
  markerClicked(key: string) {

    this.clickedMarker = key;
    console.log('Clicked marker: markerClicked() => ', this.clickedMarker);

    if (this.isClicked) {
      this.chartDestroy();
    }

    this.isClicked = true;

    if (!this.chartInit()) {
      this.dataService.sleep(500).then(() => {
        this.chartInit();
      });
    }

  }


  // /**
  //  * Chart related functions
  //  */
  // ngAfterViewInit() {

  //   this.chartInit();
  // }

  chartInit(): boolean {
    var returnVal: boolean = false;

    this.zone.runOutsideAngular(() => {

      if (document.getElementById("chartdiv2_1") == null || document.getElementById("chartdiv2_2") == null
        || document.getElementById("chartdiv2_3") == null || document.getElementById("chartdiv2_4") == null
        || document.getElementById("chartdiv2_5") == null || document.getElementById("chartdiv2_6") == null
        || document.getElementById("chartdiv2_7") == null) {
        return returnVal;
      }

      else {
        returnVal = true;

        this.chart.temp = am4core.create("chartdiv2_1", am4charts.XYChart),
          this.chart.co = am4core.create("chartdiv2_2", am4charts.XYChart),
          this.chart.o3 = am4core.create("chartdiv2_3", am4charts.XYChart),
          this.chart.no2 = am4core.create("chartdiv2_4", am4charts.XYChart),
          this.chart.so2 = am4core.create("chartdiv2_5", am4charts.XYChart),
          this.chart.pm25 = am4core.create("chartdiv2_6", am4charts.XYChart),
          this.chart.pm10 = am4core.create("chartdiv2_7", am4charts.XYChart)

        for (var key in this.chart) {

          this.chart[key].data = this.initparsedDataWithFirstkey();
          this.chart[key].paddingRight = 20;

          // Create xAxes
          var dateX = this.chart[key].xAxes.push(new am4charts.DateAxis());
          dateX.dataFields.date = "timestamp";
          //dateX.title.text = "Timestamp";
          dateX.baseInterval = { timeUnit: 'second', count: 10 };
          dateX.align = 'center';

          // Create yAxis
          var valueAxis = this.chart[key].yAxes.push(new am4charts.ValueAxis());
          valueAxis.rangeChangeDuration = 0;

          if (key != 'temp') {
            // Create AQI range grid
            var gridWidth = 0.4; var gridOpacity = 0.5
            var range = valueAxis.axisRanges.create();
            range.value = 0; // start of good
            range.grid.stroke = am4core.color("#33e081");
            range.grid.strokeWidth = gridWidth;
            range.grid.strokeOpacity = gridOpacity;

            range = valueAxis.axisRanges.create();
            range.value = 51; // start of moderate
            range.grid.stroke = am4core.color("#ebe841");

            range = valueAxis.axisRanges.create();
            range.value = 101; // start of unhealthy for sensitive groups
            range.grid.stroke = am4core.color("#f19040");

            range = valueAxis.axisRanges.create();
            range.value = 151; // start of unhealthy
            range.grid.stroke = am4core.color("#ec4545");

            range = valueAxis.axisRanges.create();
            range.value = 201; // start of very unhealthy
            range.grid.stroke = am4core.color("#b046e0");

            range = valueAxis.axisRanges.create();
            range.value = 301; // start of hazardous
            range.grid.stroke = am4core.color("#6b132e");
          }

          switch (key) {

            case ('temp'): // Temperature
              valueAxis.title.text = "Temperature"

              var series = this.chart[key].series.push(new am4charts.ColumnSeries());
              series.dataFields.valueY = "temperature";
              series.dataFields.dateX = "timestamp";
              series.name = "Temperature";
              series.tooltipText = "{name}: [bold]{valueY}[/]";
              series.yAxis = valueAxis;
              series.interpolationDuration = 0;
              series.fill = new am4core.Color({ r: 255, g: 230, b: 136, a: 1 });
              series.stroke = new am4core.Color({ r: 255, g: 230, b: 136, a: 1 });

              //console.log('series_Temp => ', series);
              break;

            case ('co'): // AQI - CO
              valueAxis.title.text = "AQI - CO"
              var series = this.chart[key].series.push(new am4charts.LineSeries());
              series.dataFields.valueY = "AQI_CO";
              series.dataFields.dateX = "timestamp";
              series.name = "CO";
              series.strokeWidth = 3;
              series.tooltipText = "{name}: [bold]{valueY}[/]";
              series.yAxis = valueAxis;
              series.interpolationDuration = 0;
              break;

            case ('o3'): // AQI - O3
              valueAxis.title.text = "AQI - O3"

              var series = this.chart[key].series.push(new am4charts.LineSeries());
              series.dataFields.valueY = "AQI_O3";
              series.dataFields.dateX = "timestamp";
              series.name = "O[sub]3[/]";
              series.strokeWidth = 3;
              series.tooltipText = "{name}: [bold]{valueY}[/]";
              series.yAxis = valueAxis;
              series.interpolationDuration = 0;
              break;

            case ('no2'):  // AQI - NO2
              valueAxis.title.text = "AQI - NO2"

              var series = this.chart[key].series.push(new am4charts.LineSeries());
              series.dataFields.valueY = "AQI_NO2";
              series.dataFields.dateX = "timestamp";
              series.name = "NO[sub]2[/]";
              series.strokeWidth = 3;
              series.tooltipText = "{name}: [bold]{valueY}[/]";
              series.yAxis = valueAxis;
              series.interpolationDuration = 0;
              break;

            case ('so2'):  // AQI - SO2
              valueAxis.title.text = "AQI - SO2"

              var series = this.chart[key].series.push(new am4charts.LineSeries());
              series.dataFields.valueY = "AQI_SO2";
              series.dataFields.dateX = "timestamp";
              series.name = "SO[sub]2[/]";
              series.strokeWidth = 3;
              series.tooltipText = "{name}: [bold]{valueY}[/]";
              series.yAxis = valueAxis;
              series.interpolationDuration = 0;
              break;

            case ('pm25'): // AQI - PM2.5
              valueAxis.title.text = "AQI - PM2.5"

              var series = this.chart[key].series.push(new am4charts.LineSeries());
              series.dataFields.valueY = "AQI_PM25";
              series.dataFields.dateX = "timestamp";
              series.name = "PM2.5";
              series.strokeWidth = 3;
              series.tooltipText = "{name}: [bold]{valueY}[/]";
              series.yAxis = valueAxis;
              series.interpolationDuration = 0;
              break;

            case ('pm10'): // AQI - PM10
              valueAxis.title.text = "AQI - PM10"
              var series = this.chart[key].series.push(new am4charts.LineSeries());
              series.dataFields.valueY = "AQI_PM10";
              series.dataFields.dateX = "timestamp";
              series.name = "PM10";
              series.strokeWidth = 3;
              series.tooltipText = "{name}: [bold]{valueY}[/]";
              series.yAxis = valueAxis;
              series.interpolationDuration = 0;
              break;
          }

          if (key != 'temp') {
            // Create yAxis Range. Only if the Key is related to AQI
            var range_good = valueAxis.createSeriesRange(series);
            range_good.value = 0;
            range_good.endValue = 50;
            // range_good.contents.stroke = am4core.color("#33e081");
            range_good.contents.stroke = am4core.color("#ace4c5");
            range_good.contents.strokeOpacity = 30;

            var range_moderate = valueAxis.createSeriesRange(series);
            range_moderate.value = 51;
            range_moderate.endValue = 100;
            // range_moderate.contents.stroke = am4core.color("#ebe841");
            range_moderate.contents.stroke = am4core.color("#e9e791");
            range_moderate.contents.strokeOpacity = 30;

            var range_unhealthy_1 = valueAxis.createSeriesRange(series);
            range_unhealthy_1.value = 101;
            range_unhealthy_1.endValue = 150;
            // range_unhealthy_1.contents.stroke = am4core.color("#f19040");
            range_unhealthy_1.contents.stroke = am4core.color("#f1c29c");
            range_unhealthy_1.contents.strokeOpacity = 30;

            var range_unhealthy_2 = valueAxis.createSeriesRange(series);
            range_unhealthy_2.value = 151;
            range_unhealthy_2.endValue = 200;
            // range_unhealthy_2.contents.stroke = am4core.color("#ec4545");
            range_unhealthy_2.contents.stroke = am4core.color("#eba5a5");
            range_unhealthy_2.contents.strokeOpacity = 30;

            var range_unhealthy_3 = valueAxis.createSeriesRange(series);
            range_unhealthy_3.value = 201;
            range_unhealthy_3.endValue = 300;
            // range_unhealthy_3.contents.stroke = am4core.color("#b046e0");
            range_unhealthy_3.contents.stroke = am4core.color("#d1a2e7");
            range_unhealthy_3.contents.strokeOpacity = 30;

            var range_hazardous = valueAxis.createSeriesRange(series);
            range_hazardous.value = 301;
            range_hazardous.endValue = 500;
            // range_hazardous.contents.stroke = am4core.color("#6b132e");
            range_hazardous.contents.stroke = am4core.color("#a87d8a");
            range_hazardous.contents.strokeOpacity = 30;

            range_hazardous.contents.fill = am4core.color('ffffff');



            //console.log(key, "series After range setting => ", series);

          }


          // Add cursor
          this.chart[key].cursor = new am4charts.XYCursor();


          this.chart[key].events.on("doublehit", (ev) => {
            console.log(ev);
          });
        }
      }
    });
    return returnVal;
  }

  initparsedDataWithFirstkey(): any {
    var tsp: number = new Date().getTime();
    var data: any = [];

    for (var i = 1; i <= 23; i++) {
      data.push({
        // AQI_CO: 0,
        // AQI_O3: 0,
        // AQI_NO2: 0,
        // AQI_SO2: 0,
        // AQI_PM25: 0,
        // AQI_PM10: 0,
        temperature: 0,
        timestamp: new Date(tsp - 1000 * (19 - i))
      });
    }

    return data;
  }

  addparsedDataWithFirstkey() {

    for (var key in this.chart) {

      if (this.chart[key].data.length > 25) {
        this.chart[key].data.shift();
      }

      this.chart[key].data.push(this.data[this.clickedMarker]);


      this.chart[key].validateData();

      //console.log(key, ' => ', this.chart[key].data);
    }
  }

  chartDestroy() {
    this.zone.runOutsideAngular(() => {
      for (var key in this.chart) {
        if (this.chart[key]) {
          this.chart[key].dispose();
        }
      }
    });
  }

  
  /** Nation */
  nationChanged(value) {
    console.log(value, this.nations2[value][1]);

    this.autocomplete.setComponentRestrictions({ 'country': [this.nations2[value][1]] });
  }
}