import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DisplayMessageService } from 'src/app/services/display-message.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() seconds: number = 10;
  @Input() visible: boolean = true;
  @Input() style: any = {};
  @Output() timeout: EventEmitter<boolean>;
  distance: number = 0;
  hours: number = 0;
  min: number = 0;
  sec: number = 0;

  private val: number;
  private interval: any;
  private inInterval: boolean;

  constructor(
    private dispMsgService: DisplayMessageService
  ) {
    this.timeout = new EventEmitter<boolean>();
  }

  ngOnInit() {
    this.dispMsgService.printLog(['SET', 'TMER', '5 minutes']);

    this.val = 0;
    this.inInterval = true;


    this.interval = setInterval(() => {
      if (this.inInterval) {
        this.val++;

        this.distance = this.seconds - this.val;
        this.hours = Math.floor(this.distance / 3600); this.distance = Math.floor(this.distance % 3600);
        this.min = Math.floor(this.distance / 60);
        this.sec = Math.floor(this.distance % 60);
        
        if (this.distance <= 0) {
          this.timeout.emit(true);
          clearInterval(this.interval);
          this.inInterval = false;
          this.val = 0;
        }
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.inInterval = false;
    this.val = 0;
  }
}