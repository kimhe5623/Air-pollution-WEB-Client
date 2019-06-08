import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../../../../services/authorization.service';

@Component({
  selector: 'app-sensor-management',
  templateUrl: './sensor-management.component.html',
  styleUrls: ['./sensor-management.component.css']
})
export class SensorManagementComponent implements OnInit {

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