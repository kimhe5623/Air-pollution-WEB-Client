import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-air-sensor-history',
  templateUrl: './air-sensor-history.component.html',
  styleUrls: ['./air-sensor-history.component.css']
})
export class AirSensorHistoryComponent implements OnInit {
  
  constructor(
    private storageService: StorageService,
    private router: Router){}

  ngOnInit(){
    if(this.storageService.get('userInfo') == null){
      this.router.navigate(['/page-not-found']);
    }
  }
}