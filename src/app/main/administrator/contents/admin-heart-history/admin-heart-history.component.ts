import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-heart-history',
  templateUrl: './admin-heart-history.component.html',
  styleUrls: ['./admin-heart-history.component.css']
})
export class AdminHeartHistoryComponent implements OnInit {

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
