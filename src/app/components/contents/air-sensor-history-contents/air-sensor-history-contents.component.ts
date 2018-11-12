import { Component, OnInit, ViewChild } from '@angular/core';
import { DataManagementService } from 'src/app/services/data-management.service';
import { DataMonitoringService } from 'src/app/services/httpRequest/data-monitoring.service';
import { FormControl, Validators } from '@angular/forms';
import { } from 'googlemaps';
import { StorageService } from 'src/app/services/storage.service';
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

  /**
   * Chart
   */
  public chartType: string = 'line';

  public airChartDataAll: Array<any> = [{ data: [], label: '' }];
  public airChartData: Array<any> = [{ data: [], label: '' }];
  public chartLabels: Array<any> = [];

  public airChartColors: Array<any> = [
    {
      backgroundColor: '#aaaaaa00',
      borderColor: '#c77676a0',
      borderWidth: 2,
      pointBackgroundColor: '#c77676a0',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#c77676a0'
    },
    {
      backgroundColor: '#aaaaaa00',
      borderColor: '#ad815ca0',
      borderWidth: 2,
      pointBackgroundColor: '#ad815ca0',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#ad815ca0'
    },
    {
      backgroundColor: '#aaaaaa00',
      borderColor: '#86b470a0',
      borderWidth: 2,
      pointBackgroundColor: '#86b470a0',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#86b470a0'
    },
    {
      backgroundColor: '#aaaaaa00',
      borderColor: '#676db6a0',
      borderWidth: 2,
      pointBackgroundColor: '#676db6a0',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#676db6a0'
    },
    {
      backgroundColor: '#aaaaaa00',
      borderColor: '#a471c2a0',
      borderWidth: 2,
      pointBackgroundColor: '#a471c2a0',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#a471c2a0'
    },
    {
      backgroundColor: '#aaaaaa00',
      borderColor: '#bd7ba9a0',
      borderWidth: 2,
      pointBackgroundColor: '#bd7ba9a0',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#bd7ba9a0'
    },
    {
      backgroundColor: '#ffeb9033',
      borderColor: '#ffe190a9',
      borderWidth: 2,
      pointBackgroundColor: '#ffe190a9',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#ffe190a9'
    },
  ];

  public chartOptions: any = {
    responsive: true,
    trackColor: false,
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Timestamp'
        }
      }],
      yAxes: [{
        id: 'AQI',
        type: 'linear',
        position: 'left',
        scalePositionLeft: true,
        scaleLabel: {
          display: true,
          labelString: 'Air Quality Index',
        }
      },
      {
        id: 'temperature',
        type: 'linear',
        position: 'right',
        scalePositionLeft: false,
        scaleLabel: {
          display: true,
          labelString: 'Temperature',
        }
      },
      ]
    }
  };


  /**----*/
  isSearched: boolean = false;


  constructor(
    private dataService: DataManagementService,
    private dmService: DataMonitoringService,
    private storageService: StorageService
  ) {
    this.startDate = new FormControl(new Date().toISOString(), [Validators.required]);
    this.endDate = new FormControl(new Date().toISOString(), [Validators.required]);
  }

  ngOnInit() {

  }

  // Functions list //

  /**
   * HTTP request data
   */
  reqData(cb) {
    var payload = {
      nsc: this.storageService.get('userInfo').nsc,
      ownershipCode: "1",
      sTs: Math.floor(new Date(this.startDate.value).getTime()/1000),
      eTs: Math.floor(new Date(new Date(this.endDate.value).setHours(23, 59, 59, 59)).getTime()/1000),
      // Number of HAV Fragments Required for Retransmission, (if it is 0, =>) List of Unsuccessful HAV Fragment Sequence Numbers
      nat: "Q30",
      state: "Q99",
      city: "Q16552",
    }

    this.dmService.HAV(payload, (result) => {
      if(result == null) cb(null);
      
      else if (result.payload.historicalAirQualityDataListEncodings.length != 0) {
        var tlvData = this.dataService.rspHistoricalAirDataParsing(result.payload.historicalAirQualityDataListEncodings);
        var tspBasedData = {};

        console.log(tlvData);

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

        console.log('parsed Data: ', this.airData);
        console.log('timeLists: ', this.timeLists);
        console.log('firstKeys: ', this.firstKeys);

        this.previousTimeSliderValue = 0;

        this.selectedTime = this.dataService.formattingDate(new Date(Number(this.timeLists[this.timeSliderValue])));
        this.selectedMac = this.dataService.rspToMacAddress(this.firstKeys[this.timeLists[this.timeSliderValue]]);
        this.selectedAirdata = this.airData[this.timeLists[this.timeSliderValue]][this.firstKeys[this.timeLists[this.timeSliderValue]]];
        console.log('selectedTime => ', this.selectedTime, ' selectedMac => ', this.selectedMac);
        console.log('selectedAirdata => ', this.selectedAirdata);


        this.mapInit();

        // Chart data
        this.airChartDataAll = this.dataService.getChartData(this.airDataForCharts[this.firstKeys[this.timeLists[0]]]);
        this.airChartSetting();


        // Chart Label data
        this.chartLabels = [];
        for (var i = 0; i < this.airChartDataAll['timestamp']['data'].length; i++) {
          this.chartLabels.push(this.dataService.formattingDate(this.airChartDataAll['timestamp']['data'][i]))
        }

        console.log('airChartDataAll => ', this.airChartDataAll);
        console.log('chartLables => ', this.chartLabels);
      }
      else {
        console.log('No selected data');
        this.selectedTime = "No selected data";
      }
    });
  }


  /**
   * this.airChart setting fn
   */
  airChartSetting() {
    this.airChartData = [];
    this.airChartData.push({ yAxisID: 'AQI', data: this.airChartDataAll['AQI_CO']['data'], label: 'CO AQI' });
    this.airChartData.push({ yAxisID: 'AQI', data: this.airChartDataAll['AQI_O3']['data'], label: 'O3 AQI' });
    this.airChartData.push({ yAxisID: 'AQI', data: this.airChartDataAll['AQI_NO2']['data'], label: 'NO2 AQI' });
    this.airChartData.push({ yAxisID: 'AQI', data: this.airChartDataAll['AQI_SO2']['data'], label: 'SO2 AQI' });
    this.airChartData.push({ yAxisID: 'AQI', data: this.airChartDataAll['AQI_PM25']['data'], label: 'PM2.5 AQI' });
    this.airChartData.push({ yAxisID: 'AQI', data: this.airChartDataAll['AQI_PM10']['data'], label: 'PM10 AQI' });
    this.airChartData.push({ yAxisID: 'temperature', data: this.airChartDataAll['temperature']['data'], label: 'Temperature' });
  }

  /**
   * When the time slider is changed,
   */
  timeSliderChanged() {
    console.log(this.timeSliderValue);

    this.selectedTime = this.dataService.formattingDate(new Date(Number(this.timeLists[this.timeSliderValue])));
    this.selectedAirdata = this.airData[this.timeLists[this.timeSliderValue]][this.firstKeys[this.timeLists[this.timeSliderValue]]];
    console.log('selectedTime => ', this.selectedTime);

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
    if (event.active.length > 0) {

      console.log(event.active[0]._index);

      this.timeSliderValue = event.active[0]._index;
      this.timeSliderChanged();
    }
  }

  /**
   * Map initialization
   */
  mapInit() {
    var mapProp = {
      center: new google.maps.LatLng(
        Number(this.airData[this.timeLists[0]][this.firstKeys[this.timeLists[0]]].latitude),
        Number(this.airData[this.timeLists[0]][this.firstKeys[this.timeLists[0]]].longitude)
      ),
      zoom: 10,
      draggableCursor: '',
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);


    /**
     * Marker & Info window
     */
    this.markers = {};
    this.infoWindow = new google.maps.InfoWindow();
    this.addNewMarkers(this.airData[this.timeLists[0]]);

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

      this.markers[key] = marker;
      this.addInfoWindow(key);
    }
  }

  /**
   * @param data: array data
   * add markers
   */
  addEachMarker(key) {

    var currentSelectedTsp: string = this.timeLists[this.timeSliderValue];

    var marker = new google.maps.Marker({
      map: this.map,
      position: { lat: this.airData[currentSelectedTsp][key].latitude, lng: this.airData[currentSelectedTsp][key].longitude },

      icon: {
        anchor: new google.maps.Point(40, 40),
        labelOrigin: new google.maps.Point(40, 40),
        origin: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(80, 80),
        url: this.getAqiIcon(this.aqiAvg(this.airData[currentSelectedTsp][key]))
      },

      label: {
        color: this.getAqiFontColor(this.aqiAvg(this.airData[currentSelectedTsp][key])),
        fontSize: '13px',
        fontWeight: '400',
        text: this.aqiAvg(this.airData[currentSelectedTsp][key]).toString(),
      },

      data: this.airData[currentSelectedTsp][key]

    });

    this.markers[key] = marker;
    this.addInfoWindow(key);

  }

  /**
   * check keys
   */
  keyCheck(cb) {
    var currentSelectedTsp = this.timeLists[this.timeSliderValue];
    var previousSelectedTsp = this.timeLists[this.previousTimeSliderValue];

    this.data = this.airData[currentSelectedTsp];

    this.removedKeys = [];
    this.newKeys = [];
    this.existedKeys = [];

    for (var key in this.markers) {

      // if existed key
      if (this.airData[previousSelectedTsp][key] != null && this.airData[currentSelectedTsp][key] != null) {
        this.existedKeys.push(key);
      }
      // if removed key
      else if (this.airData[previousSelectedTsp][key] != null) {
        this.removedKeys.push(key);
      }
      // if new key
      else if (this.airData[currentSelectedTsp][key] != null) {
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
        this.selectedAirdata = this.airData[this.timeLists[this.timeSliderValue]][this.firstKeys[this.timeLists[this.timeSliderValue]]];

        // Update the Chart data
        this.airChartDataAll = this.dataService.getChartData(this.airDataForCharts[key]);
        this.airChartSetting();
        console.log('updated airChartDataAll => ', this.airChartDataAll);

        // Chart Label data
        this.chartLabels = [];
        for (var i = 0; i < this.airChartDataAll['timestamp']['data'].length; i++) {
          this.chartLabels.push(this.dataService.formattingDate(this.airChartDataAll['timestamp']['data'][i]))
        }
        console.log('updated chartLabels => ', this.chartLabels);

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
        <p>Wifi MAC address: ${eachData.mac}</p>
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
}
