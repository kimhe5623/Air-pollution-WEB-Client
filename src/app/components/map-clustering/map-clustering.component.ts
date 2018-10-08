import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from 'googlemaps';
import { DataManagementService } from '../../services/data-management.service';
declare var google;

@Component({
  selector: 'app-map-clustering',
  templateUrl: './map-clustering.component.html',
  styleUrls: ['./map-clustering.component.css']
})
export class MapClusteringComponent implements OnInit {

  @ViewChild('map') gmapElement: any;
  map: google.maps.Map;
  mc: MarkerClusterer;
  cluster: ClusterIcon;

  constructor(
  ) { }

  ngOnInit() {

    
    ClusterIcon.prototype.createCss = function (pos) {
      var size = Math.min(this.cluster_.getMarkers().length + 10,
        100 //possible max-size of a cluster-icon
      ),

        style = ['border-radius : 50%',
          'line-height   : ' + size + 'px',
          'cursor        : pointer',
          'position      : absolute',
          'top           : ' + pos.y + 'px',
          'left          : ' + pos.x + 'px',
          'width         : ' + size + 'px',
          'height        : ' + size + 'px'
        ];
      return style.join(";") + ';';
    };


    google.maps.event.addDomListener(window, 'load', this.initialize);
  }

  initialize() {
    var center = new google.maps.LatLng(37.4419, -122.1419);

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 1,
      center: center,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var groups = {
      a: {
        markers: [],
        mc: null,
        color: 'red'
      },
      b: {
        markers: [],
        mc: null,
        color: 'gold'
      },
      c: {
        markers: [],
        mc: null,
        color: 'purple'
      }
    };
    for (var k in groups) {
      for (var i = 0; i < 300; ++i) {
        groups[k].markers.push(new google.maps.Marker({
          map: map,
          position: this.randPos()
        }));
      }
      groups[k].mc = new MarkerClusterer(map,
        groups[k].markers, {
          enableRetinaIcons: true,
          clusterClass: 'cluster cluster_' + groups[k].color
        });
    }
  }

  randPos() {
    return new google.maps.LatLng(((Math.random() * 16000 - 8000) / 100), ((Math.random() * 34000 - 17000) / 100));
  }



}
