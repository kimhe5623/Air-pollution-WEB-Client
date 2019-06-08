import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-changepw',
  templateUrl: './admin-changepw.component.html',
  styleUrls: ['./admin-changepw.component.css']
})
export class AdminChangepwComponent implements OnInit {

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
