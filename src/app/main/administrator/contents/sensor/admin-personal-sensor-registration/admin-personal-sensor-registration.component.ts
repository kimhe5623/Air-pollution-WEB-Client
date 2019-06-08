import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../../../services/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-personal-sensor-registration',
  templateUrl: './admin-personal-sensor-registration.component.html',
  styleUrls: ['./admin-personal-sensor-registration.component.css']
})
export class AdminPersonalSensorRegistrationComponent implements OnInit {

  constructor(
    private authService: AuthorizationService,
    private router: Router
  ) { }

  ngOnInit() {
    
    if(!this.authService.isUserLoggedIn()) {
      this.router.navigate(['/']);
    }
    else if(!this.authService.isAdministor()) {
      this.router.navigate(['/dashboard']);
    }
    
  }

}
