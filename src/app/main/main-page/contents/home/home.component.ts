import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  public airmapDisplay: boolean;

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
