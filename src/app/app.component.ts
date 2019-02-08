import { Component, OnInit } from '@angular/core';
import { KasService } from './services/kas.service';
import { StorageService } from './services/storage.service';
import { HEADER } from 'src/app/header';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(
    public kasService: KasService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    console.log('kasService init()');
    this.kasService.init();

    this.storageService.fnSetCurrentState(HEADER.STATE_SWP.IDLE_STATE);
  }
  
}
