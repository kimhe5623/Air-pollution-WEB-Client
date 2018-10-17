import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-air-sensor-history',
  templateUrl: './air-sensor-history.component.html',
  styleUrls: ['./air-sensor-history.component.css']
})
export class AirSensorHistoryComponent implements OnInit {
  /**
   * Slider
   */
  autoTicks = false;
  disabled = false;
  invert = false;
  max = 1000;
  min = 0;
  showTicks = true;
  step = 1;
  thumbLabel = true;
  value = 0;
  vertical = false;



  constructor() { }

  ngOnInit() {
  }

}
