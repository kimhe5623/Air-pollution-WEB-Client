import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-sensor-reg',
  templateUrl: './personal-sensor-reg.component.html',
  styleUrls: ['./personal-sensor-reg.component.css']
})
export class PersonalSensorRegComponent implements OnInit {
  
  constructor(
    private storageService: StorageService,
    private router: Router){}

  ngOnInit(){
    if(this.storageService.get('userInfo') == null){
      this.router.navigate(['/page-not-found']);
    }
  }
}