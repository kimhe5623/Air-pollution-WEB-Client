import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { UserManagementService } from '../../../services/httpRequest/user-management.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent implements OnInit {
  userInfo: any = {
    email: ''
  }

  currentMenu: any = {
    sensor: false,
    users: false,
  }

  constructor(
    private router: Router,
    private storageService: StorageService,
    private umService: UserManagementService, ) { }

  ngOnInit() {
    this.setMenu(this.storageService.get('menuNum'));
    this.userInfo.email = 'kimhe5623@naver.com';
    //this.userInfo.email = this.storageService.get('userInfo').email;
  }

  setMenu(menuNum: number) {
    this.currentMenu.sensors = false;
    this.currentMenu.users = false;

    switch (menuNum) {
      case (1):
        this.currentMenu.sensors = true;
        break;
      case (2):
        this.currentMenu.users = true;
        break;
      //case (3): ----------> sign out
    }
  }

  clickMenu(menuNum: number) {

    switch (menuNum) {
      case (0): // => dashboard
        this.storageService.set('menuNum', 0);
        this.router.navigate(['/administrator'], { skipLocationChange: true });
        break;


      case (1): // => sensor
        this.storageService.set('menuNum', 1);
        this.router.navigate([`/administrator/sensor-management`], { skipLocationChange: true });
        break;


      case (2): // => user
        this.storageService.set('menuNum', 2);
        this.router.navigate([`/administrator/user-management`], { skipLocationChange: true });
        break;


      case (3): // => sign out
        alert('sign out!');

        /** HTTP NOTIFICATION */
        var payload: any = {
          nsc: this.storageService.get('nsc')
        };
        this.umService.SGO(payload, this.storageService.get('userInfo').usn);
        this.router.navigate(['/']);

        break;
    }
  }
}

