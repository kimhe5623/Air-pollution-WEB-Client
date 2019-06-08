import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../../services/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit {
  constructor(
    private authService: AuthorizationService,
    private router: Router
  ){}
  ngOnInit(){

    if(!this.authService.isUserLoggedIn()) {
      this.router.navigate(['/']);
    }
    else if(!this.authService.isAdministor()) {
      this.router.navigate(['/dashboard']);
    }
    
  }
}