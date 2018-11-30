import { Component, OnInit, Input, DoCheck, KeyValueDiffers } from '@angular/core';
import { DataManagementService } from '../../services/data-management.service';

@Component({
  selector: 'app-air-data',
  templateUrl: './air-data.component.html',
  styleUrls: ['./air-data.component.css']
})
export class AirDataComponent implements OnInit, DoCheck {
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
    undefined: ['Undefined', 'var(--aqi-undefined)'],
  };

  air_type: any = {
    CO: ['CO', 'ppm'],
    O3: ['O3', 'ppm'],
    NO2: ['NO2', 'ppb'],
    SO2: ['SO2', 'ppb'],
    PM25: ['PM2.5', 'µg/m3'],
    PM10: ['PM10', 'µg/m3'],
  };

  /** Style */
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
    'font-size': '43px',
    'padding': '17px',
    'line-height': '80px'
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
    'font-size': '20px',
    'color': '#000000',
    'margin-right': '15px',
  };

  dominent_style: any = {
    'font-size': '20px',
    'color': 'var(--primary)',
    'font-weight': '400'
  };
  /**------------------- */

  shown_aqi: any = {};
  current_description: any = this.description.good;
  aqi_data: any = {};
  air_data: any = {};
  dominent: string = '';

  differ: any;

  constructor(
    private dataService: DataManagementService,
    private differs: KeyValueDiffers
  ) {
    this.differ = this.differs.find([]).create();
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.data);

    if (changes) {
      console.log('NgDoCheck this.data => ', this.data);
      for (var key in this.air_type) {
        this.aqi_data[key] = this.data['AQI_' + key];
        this.air_data[key] = this.data[key];
      }
      //console.log('NgDoCheck this.aqi_data => ', this.aqi_data);
      //console.log('NgDoCheck this.air_data => ', this.air_data);

      this.shown_aqi = this.dataService.minDev('CO', this.aqi_data);
      this.hover(this.shown_aqi['key']);
      this.dominent = this.shown_aqi.key;

    }
  }

  ngOnInit() {
    //console.log(">>air-data component");
    console.log('Entered data:', this.data);

    // Style setting
    this.aqi_style['width'] = `${this.radius}px`;
    this.aqi_style['height'] = `${this.radius}px`;
    this.aqi_style['background-color'] = this.hovered_color;

    this.airdata_style['width'] = `${this.sub_radius}px`;
    this.airdata_style['height'] = `${this.sub_radius}px`;

    for (var key in this.each_air_data_style) {
      this.each_air_data_style[key] = this.JSON_copy(this.airdata_style);
    }

      this.aqi_data = {
        CO: 0,
        O3: 0,
        NO2: 0,
        SO2: 0,
        PM25: 0,
        PM10: 0,
      };
      this.air_data = {
        CO: 0,
        O3: 0,
        NO2: 0,
        SO2: 0,
        PM25: 0,
        PM10: 0,
      };
      this.shown_aqi = { key: 'CO', value: 0 };
      this.dominent = 'CO';
  }

  hover(airtype: string) {

    // Data setting
    this.shown_aqi = { key: airtype, value: this.aqi_data[airtype] };
    this.current_description = this.description[this.getCurrentDescription(this.shown_aqi['value'])];
    //console.log('hover!', airtype, ' this.aqi_data => ',this.aqi_data , ' this.shown_aqi => ', this.shown_aqi);

    // Style setting
    for (var key in this.each_air_data_style) {
      this.each_air_data_style[key] = this.JSON_copy(this.airdata_style);
    }

    //console.log('hover: ', this.shown_aqi);

    this.aqi_style['border'] = "solid 12px "+ this.current_description[1];
    this.each_air_data_style[airtype]['border'] = "solid 5px " +
      this.current_description[1];
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
    else return 'undefined';
  }
}
