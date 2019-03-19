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
    this.airmapDisplay = true;
  }

  ngOnDestroy(){
    this.airmapDisplay = false;
  }

}
