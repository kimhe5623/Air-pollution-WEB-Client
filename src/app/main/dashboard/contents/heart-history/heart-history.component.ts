import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../../../services/authorization.service';

@Component({
  selector: 'app-heart-history',
  templateUrl: './heart-history.component.html',
  styleUrls: ['./heart-history.component.css']
})
export class HeartHistoryComponent implements OnInit {
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
