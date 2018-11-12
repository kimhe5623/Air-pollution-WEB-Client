import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.css']
})
export class UserChangePasswordComponent implements OnInit {

  constructor(
    private storageService: StorageService,
    private router: Router){}

  ngOnInit(){
    if(this.storageService.get('userInfo') == null){
      this.router.navigate(['/page-not-found']);
    }
  }
}
