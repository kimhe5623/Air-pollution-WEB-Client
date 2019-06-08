import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../../../../services/authorization.service';

@Component({
  selector: 'app-personal-sensor-reg',
  templateUrl: './personal-sensor-reg.component.html',
  styleUrls: ['./personal-sensor-reg.component.css']
})
export class PersonalSensorRegComponent implements OnInit {
  
  constructor(
    private authService: AuthorizationService,
    private router: Router){}

  ngOnInit(){

    if(!this.authService.isUserLoggedIn()){
      this.router.navigate(['/']);
    }
    else if(this.authService.isAdministor()){
      this.router.navigate(['/administrator']);
    }
    
  }
}