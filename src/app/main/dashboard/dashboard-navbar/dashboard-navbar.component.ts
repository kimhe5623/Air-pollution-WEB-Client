import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { UserManagementService } from '../../../services/httpRequest/user-management.service';

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
    undefined: false,
    changepw: false,
    profile: false,
    sensormg: false,
    personalsensor: false,
    airSensorHistory: false,
    HeartHistory: false
  }

  constructor(
    private router: Router,
    private storageService: StorageService,
    private umService: UserManagementService) { }

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
        this.currentMenu.undefined = true;
        break;
      case (3):
        this.currentMenu.profile = true;
        break;
      case (4):
        this.currentMenu.changepw = true;
        break;
      //case (5): -------> sign out
      case (6):
        this.currentMenu.personalsensor = true;
        break;
      case (7):
        this.currentMenu.airSensorHistory = true;
        break;
      case (8):
        this.currentMenu.HeartHistory = true;
        break;
    }
  }

  clickMenu(menuNum: number) {

    switch (menuNum) {
      case (0): // => dashboard
        this.storageService.set('menuNum', 0);
        this.router.navigate(['/dashboard']);
        break;


      case (1): // => sensor management
        this.storageService.set('menuNum', 1);
        this.router.navigate([`/dashboard/sensor-management`]);
        break;


      case (2): // => undefined
        this.storageService.set('menuNum', 2);
        this.router.navigate(['/dashboard/undefined']);
        break;


      case (3): // => profile
        this.storageService.set('menuNum', 3);
        this.router.navigate(['/dashboard/profile']);
        break;


      case (4): // => changepw
        this.storageService.set('menuNum', 4);
        this.router.navigate(['/dashboard/changepw']);
        break;


      case (5): // => sign out
        alert('sign out!');

        /** HTTP NOTIFICATION */
        var payload: any = {
          nsc: this.storageService.get('nsc')
        };
        this.umService.SGO(payload);
        this.router.navigate(['/']);

        break;


      case (6): // => personal sensor management
        this.storageService.set('menuNum', 6);
        this.router.navigate(['/dashboard/personal-sensor-management']);
        break;

      case (7): // => air sensor history
        this.storageService.set('menuNum', 7);
        this.router.navigate(['dashboard/air-sensor-history']);
        break;

      case (8): // => heart history
        this.storageService.set('menuNum', 8);
        this.router.navigate(['/dashboard/heart-history']);
        break;
    }
  }

}
