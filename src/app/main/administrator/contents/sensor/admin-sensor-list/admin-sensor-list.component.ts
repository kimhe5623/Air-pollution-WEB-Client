import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../../../services/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sensor-list',
  templateUrl: './admin-sensor-list.component.html',
  styleUrls: ['./admin-sensor-list.component.css']
})
export class AdminSensorListComponent implements OnInit {

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
