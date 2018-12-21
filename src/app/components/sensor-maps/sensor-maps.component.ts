import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { } from 'googlemaps';
import { DataManagementService } from '../../services/data-management.service';
import { DataMonitoringService } from '../../services/httpRequest/data-monitoring.service';
import { StorageService } from 'src/app/services/storage.service';
declare var google;

@Component({
  selector: 'app-sensor-maps',
  templateUrl: './sensor-maps.component.html',
  styleUrls: ['./sensor-maps.component.css']
})
export class SensorMapsComponent implements OnInit {

  @Input() isSignedin: boolean = false;
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  sensorData: any = {};
  markers: any = {};
  infoWindow: google.maps.InfoWindow;

  clickedMarker: string = '';

  constructor(
    private dataService: DataManagementService,
    private dmService: DataMonitoringService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.reqData((result) => {
      this.sensorData = result.data;

      //console.log('this.sensorData: ', this.sensorData);
      /**
       * Google maps initialization
       */
      var mapProp = {
        center: new google.maps.LatLng(
          Number(this.sensorData[result.firstKey].latitude),
          Number(this.sensorData[result.firstKey].longitude)
        ),
        zoom: 9,
        draggableCursor: '',
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

      /**
       * Marker & Info window
       */
      this.infoWindow = new google.maps.InfoWindow();
      this.addNewMarkers();
    });
  }

  // Function definition //

  /**
   * HTTP: requset data
   */
  reqData(cb) {
    var payload = {
      nsc: 0x00,
      nat: "Q30",
      state: "Q99",
      city: "Q16552"
    }
    if (this.isSignedin) {
      payload.nsc = this.storageService.fnGetNumberOfSignedInCompletions();
    }

    this.dmService.SHR(payload, (result) => {
      if (result != null) {

        var tlvData = this.dataService.rspHistoricalSensorRecordDataParsing(result.payload.historyRecordList);
        var parsedData = { firstKey: '', data: {} };

        parsedData['firstKey'] = tlvData[0].mac;
        for (var i = 0; i < tlvData.length; i++) {
          parsedData['data'][tlvData[i].mac] = tlvData[i];
        }
        //console.log('parsedrData: ', parsedData);

        cb(parsedData);
      }
      else { cb(null); }
    })
  }

  addNewMarkers() {

    for (var key in this.sensorData) {

      var marker = new google.maps.Marker({
        map: this.map,
        position: { lat: this.sensorData[key].latitude, lng: this.sensorData[key].longitude },

        icon: {
          anchor: new google.maps.Point(40, 40),
          labelOrigin: new google.maps.Point(40, 40),
          origin: new google.maps.Point(0, 0),
          scaledSize: new google.maps.Size(80, 80),
          url: 'assets/map/marker/sensor.svg'
        },

        data: this.sensorData[key]
      });

      this.markers[key] = marker;
      this.addInfoWindow(key);
    }
  }

  /**
   * add All listener for infoWindow
   */
  addInfoWindow(key) {

    //console.log('addListener =>', this.markers[key]['data']);

    google.maps.event.clearListeners(this.markers[key], 'click');

    google.maps.event.addListener(this.markers[key], 'click', () => {

      this.getInfoWindowContents(this.markers[key]['data'], (contents) => {
        this.infoWindow.close(); // Close previously opened infowindow
        this.infoWindow.setContent(contents);
        this.infoWindow.open(this.map, this.markers[key]);
        this.clickedMarker = key;

        //console.log('clicked:', key);

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
        .center { 
          text-align: center;
        }
        </style>
        <h6 style="margin-bottom:5px; line-height: 30px">${locationName}</h6>
        <p>Wifi MAC address: ${this.dataService.rspToMacAddress(eachData.mac)}</p>
        <table>
          <tr>
            <th colspan="4">Measurement Start Date</th>
            <td colspan="4">${this.dataService.formattingDate(eachData.measurementStartDate)}</td>
          </tr>
          <tr>
            <th colspan="4">Measurement End Date</th>
            <td colspan="4">${this.dataService.formattingDate(eachData.measurementEndDate)}</td>
          </tr>
          <tr>
            <th colspan="4">Sensor Activation</th>
            <td colspan="4">${eachData.activation == 0 ? 'Registered' : eachData.activation == 1 ? 'Associated' : eachData.activation == 2 ? 'Operating' : eachData.activation == 3 ? 'Deregistered' : ''}</td>
          </tr>
          <tr>
          <th colspan="8" style="border-left: solid #fff; border-right: solid #fff;"></th>
          </tr>
          <tr>
            <th colspan="8">Sensor Status</th>
          </tr>
          <tr>
            <th>Temp</th>
            <th>CO</th>
            <th>O<sub>3</sub></th>
            <th>NO<sub>2</sub></th>
            <th>SO<sub>2</sub></th>
            <th>PM2.5</th>
            <th>PM10</th>
            <th>GPS</th>
          </tr>
          <tr>
            <td class="center">${eachData.status.temp ? '<i class="fa fa-circle" style="color: #03daa4" aria-hidden="true"></i>' : '<i class="fa fa-circle" style="color: #8585858c" aria-hidden="true"></i>'}</td>
            <td class="center">${eachData.status.co ? '<i class="fa fa-circle" style="color: #03daa4" aria-hidden="true"></i>' : '<i class="fa fa-circle" style="color: #8585858c" aria-hidden="true"></i>'}</td>
            <td class="center">${eachData.status.o3 ? '<i class="fa fa-circle" style="color: #03daa4" aria-hidden="true"></i>' : '<i class="fa fa-circle" style="color: #8585858c" aria-hidden="true"></i>'}</td>
            <td class="center">${eachData.status.no2 ? '<i class="fa fa-circle" style="color: #03daa4" aria-hidden="true"></i>' : '<i class="fa fa-circle" style="color: #8585858c" aria-hidden="true"></i>'}</td>
            <td class="center">${eachData.status.so2 ? '<i class="fa fa-circle" style="color: #03daa4" aria-hidden="true"></i>' : '<i class="fa fa-circle" style="color: #8585858c" aria-hidden="true"></i>'}</td>
            <td class="center">${eachData.status.pm25 ? '<i class="fa fa-circle" style="color: #03daa4" aria-hidden="true"></i>' : '<i class="fa fa-circle" style="color: #8585858c" aria-hidden="true"></i>'}</td>
            <td class="center">${eachData.status.pm10 ? '<i class="fa fa-circle" style="color: #03daa4" aria-hidden="true"></i>' : '<i class="fa fa-circle" style="color: #8585858c" aria-hidden="true"></i>'}</td>
            <td class="center">${eachData.status.gps ? '<i class="fa fa-circle" style="color: #03daa4" aria-hidden="true"></i>' : '<i class="fa fa-circle" style="color: #8585858c" aria-hidden="true"></i>'}</td>
          </tr>
        </table> `;
      cb(contents);
    });
  }

}
