import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-air-data',
  templateUrl: './air-data.component.html',
  styleUrls: ['./air-data.component.css']
})
export class AirDataComponent implements OnInit {

  @Input() radius: number;
  @Input() font_size: string;

  @Input() sub_radius: number;
  @Input() sub_font_size: string;

  @Input() main_color: string;
  @Input() hovered_color: string;

  @Input() dominent_color: string;
  @Input() detail_font_size: string;

  shown_aqi: number = 0;
  description: any = {
    good: 'Good',
    moderate: 'Moderate',
    unhealthy1: 'Unhealthy for sensitive groups',
    unhealthy2: 'Unhealthy',
    unhealthy3: 'Very unhealthy',
    hazardous: 'Hazardous'
  }

  air_type: any = {
    CO: ['CO', 'ppm'],
    O3: ['O3', 'µg/m3'],
    NO2: ['NO2', 'ppb'],
    SO2: ['SO2', 'ppb'],
    PM25: ['PM2.5', 'µg/m3'],
    PM10: ['PM10', 'µg/m3']
  }

  AQI_style: any = {
    'width': '50px',
    'height': '50px',
    'background-color': '#585858'
  };
  Airdata_style: any = {
    'width': '30px',
    'height': '30px',
  };
  details_style: any = {
    'font-size': '15px',
    'color': '#000000',
  }
  dominent_style: {
    'color': '#082938',
  }

  constructor() { }

  ngOnInit() {
    this.AQI_style['width'] = `${this.radius}`;
    this.AQI_style['height'] = `${this.radius}`;
    this.AQI_style['background-color'] = `${this.hovered_color}`;

    this.Airdata_style['width'] = `${this.sub_radius}`;
    this.Airdata_style['height'] = `${this.sub_radius}`;
  }

}
