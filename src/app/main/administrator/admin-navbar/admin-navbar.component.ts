import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { UserManagementService } from '../../../services/httpRequest/user-management.service';
import { HEADER } from 'src/app/header';
import { SignoutService } from 'src/app/services/signout.service';

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
    changepw: false,
    profile: false,
    sensormg: false,
    personalsensor: false,
    airDataHistory: false,
    HeartHistory: false,
    adminSensormg: false,
    adminUsermg: false,
    airSensorHistory: false
  }

  constructor(
    private router: Router,
    private storageService: StorageService,
    private signoutService: SignoutService
     ) { }

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
      case (5):
        this.currentMenu.adminUsermg = true;
        break;
      case (6):
        this.currentMenu.adminSensormg = true;
        break;
      case (8):
        this.currentMenu.changepw = true;
        break;
      //case (9) => sign out
      case (10):
        this.currentMenu.airSensorHistory = true;
        break;

    }
  }

  clickMenu(menuNum: number) {

    switch (menuNum) {
      case (0): // => dashboard
        this.storageService.set('menuNum', 0);
        this.router.navigate([HEADER.ROUTER_PATHS.ADMIN_DASHBOARD]);
        break;

      case (1): // => sensor management
        this.storageService.set('menuNum', 1);
        this.router.navigate([HEADER.ROUTER_PATHS.ADMIN_SENSOR_LIST]);
        break;

      case (2): // => personal sensor management
        this.storageService.set('menuNum', 2);
        this.router.navigate([HEADER.ROUTER_PATHS.ADMIN_PERSONAL_SENSOR_MANAGEMENT]);
        break;

      case (3): // => air sensor history
        this.storageService.set('menuNum', 3);
        this.router.navigate([HEADER.ROUTER_PATHS.ADMIN_AIR_HISTORY]);
        break;

      case (4): // => heart history
        this.storageService.set('menuNum', 4);
        this.router.navigate([HEADER.ROUTER_PATHS.ADMIN_HEART_HISTORY]);
        break;

      case (5): // => admin user management
        this.storageService.set('menuNum', 5);
        this.router.navigate([HEADER.ROUTER_PATHS.ADMIN_ALL_USERS_MANAGEMENT]);
        break;

      case (6): // => admin sensor management
        this.storageService.set('menuNum', 6);
        this.router.navigate([HEADER.ROUTER_PATHS.ADMIN_ALL_SENSORS_MANAGEMENT]);
        break;

      case (8): // => changepw
        this.storageService.set('menuNum', 8);
        this.router.navigate([HEADER.ROUTER_PATHS.ADMIN_CHANGE_PW]);
        break;

      case (9): // => sign out
        this.signoutService.run();
        break;

      case (10):
        this.storageService.set('menuNum', 10);
        this.router.navigate([HEADER.ROUTER_PATHS.ADMIN_SENSOR_HISTORY]);
        break;
    }
  }

  clickLogo(){
    this.storageService.set('menuNum', 0);
    this.router.navigate(['/administrator']);
  }
}

