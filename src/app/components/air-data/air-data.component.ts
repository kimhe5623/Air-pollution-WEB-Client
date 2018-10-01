import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-air-data',
  templateUrl: './air-data.component.html',
  styleUrls: ['./air-data.component.css']
})
export class AirDataComponent implements OnInit {
  @Input() radius: number;
  @Input() sub_radius: number;

  @Input() main_color: string;
  @Input() main_font_color: string;
  @Input() hovered_color: string;
  @Input() hovered_font_color: string;

  @Input() dominent_color: string;

  @Input() data: any;

  description: any = {
    good: ['Good', 'var(--aqi-good)'],
    moderate: ['Moderate', 'var(--aqi-moderate)'],
    unhealthy1: ['Unhealthy for sensitive groups', 'var(--aqi-unhealthy-for-sensitive-groups'],
    unhealthy2: ['Unhealthy', 'var(--aqi-unhealthy)'],
    unhealthy3: ['Very unhealthy', 'var(--aqi-very-unhealthy)'],
    hazardous: ['Hazardous', 'var(--aqi-hazardous)'],
  };

  air_type: any = {
    CO: ['CO', 'ppm'],
    O3: ['O3', 'µg/m3'],
    NO2: ['NO2', 'ppb'],
    SO2: ['SO2', 'ppb'],
    PM25: ['PM2.5', 'µg/m3'],
    PM10: ['PM10', 'µg/m3'],
  };

  aqi_style: any = {
    'height': '150px',
    'width': '150px',
    'background-color': 'var(--grey)',
    'border-radius': '50%',
    'display': 'inline-block',
    'color': '#FFFFFF',
    'border': 'solid 12px var(--aqi-good)',
    'text-align': 'center',
    'margin-right': '8px',
    'font-size': '40px',
    'padding': '17px',
    'line-height': 'normal'
  };

  airdata_style: any = {
    'width': '80px',
    'height': '80px',
    'border-radius': '50%',
    'display': 'inline-block',
    'border': 'solid 5px var(--grey)',
    'color': '#000',
    'background-color': '#FFF',
    'line-height': '70px',
    'text-align': 'center',
    'margin-right': '8px',
    'margin-top': '10px',
    'font-size': '20px'
  };
  each_air_data_style: any = {
    CO: {},
    O3: {},
    NO2: {},
    SO2: {},
    PM25: {},
    PM10: {},
  }

  details_style: any = {
    'font-size': '15px',
    'color': '#000000',
  };

  dominent_style: {
    'color': '#082938',
  };

  shown_aqi: number = 10;
  current_description: string = this.description.good;

  constructor() { }

  ngOnInit() {
    this.aqi_style['width'] = `${this.radius}px`;
    this.aqi_style['height'] = `${this.radius}px`;
    this.aqi_style['background-color'] = this.hovered_color;

    this.airdata_style['width'] = `${this.sub_radius}px`;
    this.airdata_style['height'] = `${this.sub_radius}px`;

    for (var key in this.each_air_data_style) {
      this.each_air_data_style[key] = this.JSON_copy(this.airdata_style);
      console.log(this.each_air_data_style[key]);
    }
  }

  hover(airtype: string) {

    for (var key in this.each_air_data_style) {
      this.each_air_data_style[key] = this.JSON_copy(this.airdata_style);
      console.log(this.each_air_data_style[key]);
    }

    this.each_air_data_style[airtype]['border'] = "solid 5px " +
      this.description[this.getCurrentDescription(this.shown_aqi)][1];
      console.log(this.each_air_data_style[airtype]['border']);
    this.each_air_data_style[airtype]['background-color'] = "var(--grey)";
    this.each_air_data_style[airtype]['color'] = "#FFF";
 
  }

  JSON_copy(data: any): any {
    return JSON.parse(JSON.stringify(data));
  }

  getCurrentDescription(aqi: number): string {
    if (aqi >= 0 && aqi <= 50) return 'good';
    else if (aqi >= 51 && aqi <= 100) return 'moderate';
    else if (aqi >= 101 && aqi <= 150) return 'unhealthy1';
    else if (aqi >= 151 && aqi <= 200) return 'unhealthy2';
    else if (aqi >= 201 && aqi <= 300) return 'unhealthy3';
    else if (aqi >= 301 && aqi <= 500) return 'hazardous';
  }
}
