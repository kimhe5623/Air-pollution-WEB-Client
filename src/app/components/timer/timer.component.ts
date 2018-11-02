import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { timer } from 'rxjs/observable/timer';
@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  @Input() seconds: number = 10;
  @Input() visible: boolean = true;
  @Input() style: any = {};
  @Output() timeout: EventEmitter<boolean>;
  distance: number = 0;
  hours: number = 0;
  min: number = 0;
  sec: number = 0;
  constructor() {
    this.timeout = new EventEmitter<boolean>();
  }
  ngOnInit() {
    console.log(this.style);
    /*
      timer takes a second argument, how often to emit subsequent values
      in this case we will emit first value after 1 second and subsequent
      values every 2 seconds after
    */
    const source = timer(0, 1000);
    //output: 0,1,2,3,4,5......
    const subscribe = source.subscribe(val => {
      this.distance = this.seconds - val;
      this.hours = Math.floor(this.distance / 3600); this.distance = Math.floor(this.distance % 3600);
      this.min = Math.floor(this.distance / 60);
      this.sec = Math.floor(this.distance % 60);
      this.timeout.emit(false);
      if (this.distance <= 0) {
        this.timeout.emit(true);
        subscribe.unsubscribe();
      }
    });
  }
}