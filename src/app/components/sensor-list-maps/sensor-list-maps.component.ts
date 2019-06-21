import { Component, OnInit, Input, Output, EventEmitter, ViewChild, DoCheck, KeyValueDiffers  } from '@angular/core';
import { } from 'googlemaps';
declare var google;

@Component({
  selector: 'app-sensor-list-maps',
  templateUrl: './sensor-list-maps.component.html',
  styleUrls: ['./sensor-list-maps.component.css']
})
export class SensorListMapsComponent implements OnInit, DoCheck {

  @Input() focusedIdx: number = -1;
  @Input() data: any = [];
  @Output() clickMarker = new EventEmitter<number>()

  @ViewChild('gmap') gmapElement: any;

  differ: any;
  currentFocusedMarkerIdx: number = -1;
  map: google.maps.Map;
  markers: any = [];

  constructor(
    private differs: KeyValueDiffers
  ) { 
    this.differ = this.differs.find([]).create();
  }

  ngOnInit() {

  }

  ngDoCheck() {

    const changes = this.differ.diff([this.data, this.focusedIdx]);

    if (changes) {
      if (this.focusedIdx != this.currentFocusedMarkerIdx) {
        this.focus(this.focusedIdx);
      }
      else {
        this.mapInit();
      }
    }
    
  }


  mapInit() {

    if (this.data.length != 0) {
      var mapProp = {
        center: new google.maps.LatLng(
          this.data[0].lat,
          this.data[0].lng
        ),
        zoom: 10,
        draggableCursor: '',
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true, // a way to quickly hide all controls
        mapTypeControl: false,
        scaleControl: true,
        zoomControl: true,
      };

      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
      this.currentFocusedMarkerIdx = -1;
      this.focusedIdx = -1
      this.addNewMarkers();
    }

  }

  addNewMarkers() {

    for (var i = 0; i < this.data.length; i++) {

      var marker = new google.maps.Marker({
        map: this.map,
        position: new google.maps.LatLng(this.data[i].lat, this.data[i].lng),

        icon: {
          anchor: new google.maps.Point(0, 20),
          origin: new google.maps.Point(0, 0),
          scaledSize: new google.maps.Size(40, 40),
          url: i == this.currentFocusedMarkerIdx ? 'assets/map/marker/map-marker-focused.svg' : 'assets/map/marker/map-marker-unfocused.svg'
        },

        data: this.data[i]
      });

      this.markers.push(marker);
    }

    for(var i=0; i<this.markers.length; i++) {
      this.addClickEvent(i);
    }

  }

  addClickEvent(idx: number) {
    google.maps.event.addListener(this.markers[idx], 'click', () => {
      this.clickMarker.emit(idx);
    });
  }

  focus(idx: number) {

    if(this.currentFocusedMarkerIdx != -1) {
      this.markers[this.currentFocusedMarkerIdx].setIcon(
        {
          anchor: new google.maps.Point(0, 20),
          labelOrigin: new google.maps.Point(20, 20),
          origin: new google.maps.Point(0, 0),
          scaledSize: new google.maps.Size(40, 40),
          url: 'assets/map/marker/map-marker-unfocused.svg'
        }
      );
    }

    if(idx != -1) {
      this.markers[idx].setIcon(
        {
          anchor: new google.maps.Point(0, 20),
          labelOrigin: new google.maps.Point(20, 20),
          origin: new google.maps.Point(0, 0),
          scaledSize: new google.maps.Size(40, 40),
          url: 'assets/map/marker/map-marker-focused.svg'
        }
      );
   
      this.map.setCenter(new google.maps.LatLng(this.markers[idx].data.lat, this.markers[idx].data.lng));
    }
      
    this.currentFocusedMarkerIdx = idx;
    this.focusedIdx = idx;
  }

}
