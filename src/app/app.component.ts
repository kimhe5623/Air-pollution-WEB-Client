import { Component, OnInit } from '@angular/core';
import { KasService } from './services/kas.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(
    public kasService: KasService
  ) {}

  ngOnInit() {
    console.log('kasService init()');
    this.kasService.init();
    
  }
  
}
