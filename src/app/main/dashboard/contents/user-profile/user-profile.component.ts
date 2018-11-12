import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit() {

    if(this.storageService.get('userInfo') == null){
      this.router.navigate(['/page-not-found']);
    }
  }

}
