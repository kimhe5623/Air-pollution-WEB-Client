import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../../../services/authorization.service';

@Component({
  selector: 'app-air-sensor-history',
  templateUrl: './air-sensor-history.component.html',
  styleUrls: ['./air-sensor-history.component.css']
})
export class AirSensorHistoryComponent implements OnInit {
  
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