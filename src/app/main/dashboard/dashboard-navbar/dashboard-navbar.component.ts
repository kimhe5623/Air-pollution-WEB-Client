import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { UserManagementService } from '../../../services/httpRequest/user-management.service';
import { HEADER } from 'src/app/header';
import { SignoutService } from 'src/app/services/signout.service';

@Component({
  selector: 'app-dashboard-navbar',
  templateUrl: './dashboard-navbar.component.html',
  styleUrls: ['./dashboard-navbar.component.css']
})
export class DashboardNavbarComponent implements OnInit {
  userInfo: any = {
    email: ''
  }

  currentMenu: any = {
    changepw: false,
    profile: false,
    sensormg: false,
    personalsensor: false,
    airDataHistory: false,
    airSensorHistory: false,
    HeartHistory: false
  }

  constructor(
    private router: Router,
    private storageService: StorageService,
    private umService: UserManagementService,
    private signoutService: SignoutService) { }

  ngOnInit() {
    this.setMenu(this.storageService.get('menuNum'));
    this.userInfo.email = this.storageService.get('userInfo').email;
  }
  setMenu(menuNum: number) {

    for (var key in this.currentMenu) {
      this.currentMenu[key] = false;
    }

    switch (menuNum) {
      case (1):
        this.currentMenu.sensormg = true;
        break;
      case (2):
        this.currentMenu.personalsensor = true;
        break;
      case (3):
        this.currentMenu.airDataHistory = true;
        break;
      case (4):
        this.currentMenu.HeartHistory = true;
        break;
      case (6):
        this.currentMenu.changepw = true;
        break;
      //case (7): -------> sign out
      case(8):
        this.currentMenu.airSensorHistory = true;
        break;


    }
  }

  clickMenu(menuNum: number) {

    switch (menuNum) {
      case (0): // => dashboard
        this.storageService.set('menuNum', 0);
        this.router.navigate([HEADER.ROUTER_PATHS.COMMON_USER_DASHBOARD]);
        break;


      case (1): // => sensor management
        this.storageService.set('menuNum', 1);
        this.router.navigate([HEADER.ROUTER_PATHS.COMMON_USER_SENSOR_LIST]);
        break;

      case (2): // => personal sensor management
        this.storageService.set('menuNum', 2);
        this.router.navigate([HEADER.ROUTER_PATHS.COMMON_USER_PERSONAL_SENSOR_MANAGEMENT]);
        break;

      case (3): // => air sensor history
        this.storageService.set('menuNum', 3);
        this.router.navigate([HEADER.ROUTER_PATHS.COMMON_USER_AIR_HISTORY]);
        break;

      case (4): // => heart history
        this.storageService.set('menuNum', 4);
        this.router.navigate([HEADER.ROUTER_PATHS.COMMON_USER_HEART_HISTORY]);
        break;

      case (6): // => changepw
        this.storageService.set('menuNum', 6);
        this.router.navigate([HEADER.ROUTER_PATHS.COMMON_USER_CHANGE_PW]);
        break;


      case (7): // => sign out
        this.signoutService.run();
        break;
      
      case(8):
        this.storageService.set('menuNum', 8);
        this.router.navigate([HEADER.ROUTER_PATHS.COMMON_USER_SENSOR_HISTORY]);
        break;

    }
  }

}
