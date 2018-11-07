import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private airmapDisplay: boolean;

  constructor() { }

  ngOnInit() {
    console.log('home.component ngOnInit()');
    this.airmapDisplay = true;
  }

  ngOnDestroy(){
    console.log('home.component ngOnDestroy()');
    this.airmapDisplay = false;
  }

}
