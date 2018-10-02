import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.css']
})
export class TemperatureComponent implements OnInit, OnChanges {
  @Input() temperature: number = 0;
  @Input() unit: UnitsType = 'default';
  @Input() primary_color: string = '#000000';
  @Input() secondary_color: string = '#b4b4b4';
  @Input() temperature_style: any = { 'font-size': '3rem' };
  @Input() unit_style: any = { 'font-size': '1rem' };
  @Output() unitChange: EventEmitter<UnitsType>;


  celsius_style: any = {};
  fahrenheit_style: any = {};
  division_style: any = {};

  isCelsius: boolean = true;

  celsius: number;
  fahrenheit: number;

  constructor() { 
    this.unitChange = new EventEmitter<UnitsType>();
  }

  ngOnInit() {

    this.temperature_style['color'] = this.primary_color;

    this.celsius_style = this.JSON_copy(this.unit_style);
    this.celsius_style['color'] = this.primary_color;

    this.fahrenheit_style = this.JSON_copy(this.unit_style);
    this.fahrenheit_style['color'] = this.secondary_color;

    this.division_style = this.JSON_copy(this.unit_style);


    this.celsius = 0;
    this.fahrenheit = 0;

  }

  ngOnChanges(){
    if (this.unit == 'default' || this.unit == 'C') {
      this.celsius = this.temperature;
      this.fahrenheit = Math.floor(this.temperature * 1.8 + 32);
    }
    else if (this.unit == 'F') {
      this.fahrenheit = this.temperature;
      this.celsius = Math.floor((this.temperature - 50) * 0.5556);
    }
  }

  JSON_copy(object: any): any{
    var result: any = {};
    for(var key in object){
      result[key] = object[key];
    }
    return result;
  }

  click(unit: UnitsType) {

    if (unit == 'C' || unit == 'default') {
      this.temperature = this.celsius;
      this.celsius_style['color'] = this.primary_color;
      this.fahrenheit_style['color'] = this.secondary_color;
    }

    else if(unit == 'F') {
      this.temperature = this.fahrenheit;
      this.celsius_style['color'] = this.secondary_color;
      this.fahrenheit_style['color'] = this.primary_color;
    }
    this.unitChange.emit(unit);
  }

}

export declare type UnitsType = 'C' | 'F' | 'default';

