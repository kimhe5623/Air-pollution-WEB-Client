import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../../../services/authorization.service';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent implements OnInit, OnDestroy {

  public contentDisplay: boolean;

  constructor(
    private router: Router,
    private authService: AuthorizationService
  ){}

  ngOnInit(){
    this.contentDisplay = true;

    if(!this.authService.isUserLoggedIn()){
      this.router.navigate(['/']);
    }
    else if(this.authService.isAdministor()){
      this.router.navigate(['/administrator']);
    }

  }
  ngOnDestroy(){
    this.contentDisplay = false;
  }

}