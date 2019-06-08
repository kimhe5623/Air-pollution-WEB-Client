import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../../../services/authorization.service';

@Component({
  selector: 'app-deregister-account',
  templateUrl: './deregister-account.component.html',
  styleUrls: ['./deregister-account.component.css']
})
export class DeregisterAccountComponent implements OnInit {
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