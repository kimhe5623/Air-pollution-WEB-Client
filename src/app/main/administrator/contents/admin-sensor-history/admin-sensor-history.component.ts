import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../../services/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sensor-history',
  templateUrl: './admin-sensor-history.component.html',
  styleUrls: ['./admin-sensor-history.component.css']
})
export class AdminSensorHistoryComponent implements OnInit {

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
