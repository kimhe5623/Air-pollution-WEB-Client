import { Component, OnInit, ViewChild } from '@angular/core';
import { DataMonitoringService } from 'src/app/services/httpRequest/data-monitoring.service';
import { DataManagementService } from 'src/app/services/data-management.service';
import { FormControl, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { } from 'googlemaps';
declare var google;

@Component({
  selector: 'app-heart-history-contents',
  templateUrl: './heart-history-contents.component.html',
  styleUrls: ['./heart-history-contents.component.css']
})
export class HeartHistoryContentsComponent implements OnInit {
  startDate: FormControl;
  endDate: FormControl;

  isSearched: boolean;

  numOfData: number = 0;
  heartHistoryData: any = [];


  /**
   * Maps
   isClicked: boolean = false;
   */
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  heartMarker: any = {};
  infoWindow: any = {};
  clickedLocation: any = { latitude: 0, longitude: 0 };

  /**
   * Map card
   */
  currentIndex: number = 0;
  currentAddress: string = 'No selected data';
  clickedTimestamp: string = '';

  constructor(
    private dmService: DataMonitoringService,
    private dataService: DataManagementService,
    private storageService: StorageService
  ) {
    this.startDate = new FormControl(new Date().toISOString(), [Validators.required]);
    this.endDate = new FormControl(new Date().toISOString(), [Validators.required]);
  }

  ngOnInit() {
    this.isSearched = false;
  }

  /** 
   * Request data  
   */
  reqData(tlv: any, cb) {
    console.log('startDate: ', this.startDate.value, ' endDate: ', this.endDate.value);
    var payload = {
      nsc: this.storageService.get('userInfo').nsc,
      sTs: Math.floor(new Date(this.startDate.value).getTime()/1000),
      eTs: Math.floor(new Date(new Date(this.endDate.value).setHours(23, 59, 59, 59)).getTime()/1000),
      nat: "Q30",
      state:"Q99",
      city:"Q16552"
    };

    if (tlv != null) payload['tlv'] = tlv

    this.dmService.HHV(payload, (rspMsg) => {

      this.heartHistoryData = this.dataService.rspHistoricalHeartDataParsing(rspMsg.payload.historicalHeartQualityDataListEncodings);
      this.numOfData = this.heartHistoryData.length;
      console.log(this.numOfData);

      cb(null);

    });
  }

  /**
   * Search history: When the search button is clicked,
   */
  searchHistory() {
    this.isSearched = true;
    this.reqData(null, () => {
      
      if(this.numOfData > 0){
        this.setMapCardData(0);
        this.mapInit();
      }

    });
  }

  setMapCardData(idx) {
    this.currentIndex = idx;
    this.clickedLocation = { lat: this.heartHistoryData[this.currentIndex].latitude, lng: this.heartHistoryData[this.currentIndex].longitude };

    this.dmService.latlngToAddress(this.clickedLocation.lat, this.clickedLocation.lng, (address) => {

      if (address.status == 'OK') this.currentAddress = address.results[0].formatted_address;
      else this.currentAddress = 'No address data';

    });

    this.clickedTimestamp = this.dataService.formattingDate(this.heartHistoryData[this.currentIndex].timestamp);
  }

  /**
   * Google maps initialization 
   */
  mapInit() {

    // map
    var mapProp = {
      center: new google.maps.LatLng(this.clickedLocation),
      zoom: 10,
      draggableCursor: '',
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.infoWindow = new google.maps.InfoWindow();

    // marker
    this.heartMarker = new google.maps.Marker({
      map: this.map,
      position: { lat: this.heartHistoryData[0].latitude, lng: this.heartHistoryData[0].longitude },

      icon: {
        anchor: new google.maps.Point(30, 30),
        labelOrigin: new google.maps.Point(30, 30),
        origin: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(60, 60),
        url: 'assets/map/marker/heart.svg'
      },

      label: {
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: '400',
        text: this.heartHistoryData[0].heartrate.toString(),
      },
    });

    this.setInfoWindow(0);
  }

  /**
   * When chart data is clicked,
   * @param event : the emitted event data
   */
  chartClicked(event) {

    if (event > 0) {
      this.setMapCardData(event);
      this.map.setCenter(this.clickedLocation);
      this.changeMarkerTo(this.currentIndex);
    }

  }

  /**
   * @param idx: the clicked data index
   * change marker
   */
  changeMarkerTo(idx: number) {

    console.log('clicked Data=>', this.heartHistoryData[idx]);

    this.infoWindow.close();
    this.heartMarker.setLabel({
      color: '#ffffff',
      fontSize: '13px',
      fontWeight: '400',
      text: this.heartHistoryData[idx].heartrate.toString(),
    });
    this.heartMarker.setPosition(this.clickedLocation);


    this.setInfoWindow(idx);
  }

  /**
   * @param idx: the clicked data index
   * add infowindow
   */
  setInfoWindow(idx: number) {

    google.maps.event.clearListeners(this.heartMarker, 'click');

    google.maps.event.addListener(this.heartMarker, 'click', () => {

      console.log('heartMarkerdata=>', this.heartHistoryData[idx]);
      this.getInfoWindowContents(this.heartHistoryData[idx], (contents) => {
        this.infoWindow.close(); // Close previously opened infowindow
        this.infoWindow.setContent(contents);
        this.infoWindow.open(this.map, this.heartMarker);
      });

    });
  }

  /**
  * @param eachData : each data
  * get infoWindow contents
  */
  getInfoWindowContents(eachData: any, cb) {

      var locationName: string = locationName = `<strong>lat</strong>&nbsp; ${eachData.latitude}<br><strong>lng</strong>&nbsp; ${eachData.longitude}`;

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
        <hr>
        <h4 style="text-align:center"><strong>${eachData.heartrate}</strong> <sub>bpm</sub></h4>
         `;
      cb(contents);

  }

}