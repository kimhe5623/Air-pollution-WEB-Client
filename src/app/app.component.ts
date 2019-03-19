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
  ) {}

  ngOnInit() {
    this.kasService.init();
  }
  
}
