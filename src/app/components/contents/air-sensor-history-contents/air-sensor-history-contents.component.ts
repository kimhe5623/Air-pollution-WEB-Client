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
  circles: any = {};
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

  /**
   * Forms
   */
  startDate: FormControl;
  endDate: FormControl;

  /**
   * Data
   */
  airData: any = {};
  airDataForCharts: any = {};
  timeLists: any = [];
  selectedTsp: string = "";
  selectedTime: string = "";
  selectedMac: string = "";
  selectedAirdata: any = {};
  firstKeys: any = {};

  /**
   * Key check
   */
  removedKeys: any = [];
  newKeys: any = [];
  existedKeys: any = [];


  /**----*/
  isSearched: boolean = false;


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
  }

  // Functions list //

  /**
   * HTTP request data
   */
  reqData(cb) {
    var payload = {
      nsc: Number(this.storageService.fnGetNumberOfSignedInCompletions()),
      ownershipCode: "1",
      sTs: Math.floor(new Date(this.startDate.value).getTime() / 1000),
      eTs: Math.floor(new Date(new Date(this.endDate.value).setHours(23, 59, 59, 59)).getTime() / 1000),
      // Number of HAV Fragments Required for Retransmission, (if it is 0, =>) List of Unsuccessful HAV Fragment Sequence Numbers
      nat: "Q30",
      state: "Q99",
      city: "Q16552",
    }

    this.dmService.fnHav(payload, (result) => {
      if (result == null) cb(null);

      else if (result.payload.historicalAirQualityDataListEncodings.length != 0) {
        var tlvData = this.dataService.rspHistoricalAirDataParsing(result.payload.historicalAirQualityDataListEncodings);
        var tspBasedData = {};

        //console.log(tlvData);

        /** Data parsing for "this.airData" */
        for (var i = 0; i < tlvData.length; i++) {

          var currentTsp: number = new Date(tlvData[i].timestamp).getTime();
          tspBasedData[currentTsp.toString()] = {};

          if (!this.dataService.checkValueExist(currentTsp.toString(), this.timeLists)) {
            /** Data parsing for "this.timeLists" */
            this.timeLists.push(currentTsp.toString());

            /** Data parsing for "this.firstKeys" */
            this.firstKeys[currentTsp.toString()] = tlvData[i].mac;
          }

          /** Data parsing for "this.airDataForChart" */
          this.airDataForCharts[tlvData[i].mac] = [];
        }

        for (var i = 0; i < tlvData.length; i++) {
          var currentTsp: number = new Date(tlvData[i].timestamp).getTime();
          tspBasedData[currentTsp.toString()][tlvData[i].mac] = tlvData[i];

          this.airDataForCharts[tlvData[i].mac].push(tlvData[i]);
        }

        console.log('airDataForCharts => ', this.airDataForCharts);
        console.log('selected Mac => ', this.selectedMac);

        this.timeLists.sort();
        this.timeSliderMax = this.timeLists.length - 1;

        cb(tspBasedData);
      }
      else {
        cb(null);
      }

    });
  }

  /**
   * When the search button is clicked,
   */
  searchHistory() {
    this.isSearched = true;

    this.reqData((result) => {
      if (result != null) {

        this.airData = result;

        //console.log('parsed Data: ', this.airData);
        //console.log('timeLists: ', this.timeLists);
        //console.log('firstKeys: ', this.firstKeys);

        this.previousTimeSliderValue = 0;

        this.selectedTsp = this.timeLists[this.timeSliderValue];
        this.selectedTime = this.dataService.formattingDate(new Date(Number(this.selectedTsp)));

        this.selectedMac = this.firstKeys[this.selectedTsp];
        this.selectedAirdata = this.airData[this.selectedTsp][this.selectedMac];
        //console.log('selectedTime => ', this.selectedTime, ' selectedMac => ', this.selectedMac);
        //console.log('selectedAirdata => ', this.selectedAirdata);


        this.mapInit();

      }
      else {
        console.log('No selected data');
        this.selectedTime = "No selected data";
      }
    });
  }



  /**
   * When the time slider is changed,
   */
  timeSliderChanged() {
    //console.log(this.timeSliderValue);

    this.selectedTsp = this.timeLists[this.timeSliderValue];
    this.selectedTime = this.dataService.formattingDate(new Date(Number(this.selectedTsp)));
    this.selectedAirdata = this.airData[this.selectedTsp][this.selectedMac];

    //console.log('selectedTime => ', this.selectedTime);

    this.keyCheck(() => {
      // In case of existed Keys,
      for (var i = 0; i < this.existedKeys.length; i++) {
        this.updateMarker(this.existedKeys[i]);
      }

      // In case of new Keys,
      for (var i = 0; i < this.newKeys.length; i++) {
        this.addEachMarker(this.newKeys[i]);
      }

      // In case of removed Keys,
      for (var i = 0; i < this.removedKeys.length; i++) {
        this.removeMarkerOnMap(this.removedKeys[i]);
      }
    });


    this.previousTimeSliderValue = this.timeSliderValue;
  }

  /**
   * When the chart is clicked
   */
  chartClicked(event) {

    console.log('chart click event function:air-sensor-history-contents.component => ', event);

    this.timeSliderValue = event;
    this.timeSliderChanged();

  }

  /**
   * Map initialization
   */
  mapInit() {

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
      console.log('currentAddress => ', currentAddress);
      var mapProp = {
        center: new google.maps.LatLng(
          Number(this.airData[this.timeLists[0]][this.firstKeys[this.timeLists[0]]].latitude),
          Number(this.airData[this.timeLists[0]][this.firstKeys[this.timeLists[0]]].longitude)
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

        if (!place.geometry) {
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
       * Marker & Info window
       */
      this.markers = {};
      this.infoWindow = new google.maps.InfoWindow();
      this.addNewMarkers(this.airData[this.timeLists[0]]);
    });

  }

  //==============================================================
  /**
   * @param data: array data
   * add markers when the maps is initialized.
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
   * add markers
   */
  addEachMarker(key) {


    var marker = new google.maps.Marker({
      map: this.map,
      position: { lat: this.airData[this.selectedTsp][key].latitude, lng: this.airData[this.selectedTsp][key].longitude },

      icon: {
        anchor: new google.maps.Point(40, 40),
        labelOrigin: new google.maps.Point(40, 40),
        origin: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(80, 80),
        url: this.getAqiIcon(this.aqiAvg(this.airData[this.selectedTsp][key]))
      },

      label: {
        color: this.getAqiFontColor(this.aqiAvg(this.airData[this.selectedTsp][key])),
        fontSize: '13px',
        fontWeight: '400',
        text: this.aqiAvg(this.airData[this.selectedTsp][key]).toString(),
      },

      data: this.airData[this.selectedTsp][key]

    });

    this.markers[key] = marker;
    this.addInfoWindow(key);

  }

  /**
   * check keys
   */
  keyCheck(cb) {

    var previousSelectedTsp = this.timeLists[this.previousTimeSliderValue];

    this.data = this.airData[this.selectedTsp];

    this.removedKeys = [];
    this.newKeys = [];
    this.existedKeys = [];

    for (var key in this.markers) {

      // if existed key
      if (this.airData[previousSelectedTsp][key] != null && this.airData[this.selectedTsp][key] != null) {
        this.existedKeys.push(key);
      }
      // if removed key
      else if (this.airData[this.selectedTsp][key] != null) {
        this.removedKeys.push(key);
      }
      // if new key
      else if (this.airData[this.selectedTsp][key] != null) {
        this.newKeys.push(key);
      }
    }

    cb(null);
  }

  /**
    * update markers (if the key is existed)
    */
  updateMarker(key) {

    var isChanged: boolean = false;

    // Comparing both of data
    for (var key_ in this.markers[key]['data']) {
      if (this.data[key][key_] != this.markers[key]['data'][key_]) {
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

        // Update the selected Mac value & selected Air data
        this.selectedMac = key;
        this.selectedAirdata = this.airData[this.selectedTsp][this.selectedMac];

        console.log('Selected Mac => ', this.selectedMac);

      });
    });

    // Open the infowindow of firstKey
    if (key == this.firstKeys[this.timeLists[0]]) {
      this.getInfoWindowContents(this.markers[key]['data'], (contents) => {
        this.infoWindow.close(); // Close previously opened infowindow
        this.infoWindow.setContent(contents);
        this.infoWindow.open(this.map, this.markers[key]);
      });
    }

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
        button {
          margin-top: 10px;
          width: auto;
          border-radius: 100px;
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
        </table>
        `;
      cb(contents);
    });
  }

  clickbutton() {
    alert("click button!");
  }
  /**
   * @param marker : marker object
   *  remove marker on the map
   */
  removeMarkerOnMap(key) {
    this.markers[key].setMap(null);

    delete this.markers[key];
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
