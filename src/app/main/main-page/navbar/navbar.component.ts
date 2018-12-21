import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() currentMenu: any = {
    solutions: false,
    technology: false,
    introduction: false
  }

  constructor(
    private router: Router,
    private storageService: StorageService, ) { }

  ngOnInit() {
    this.setMenu(this.storageService.get('menuNum'));
  }

  setMenu(menuNum: number) {
    this.currentMenu.solutions = false;
    this.currentMenu.technology = false;
    this.currentMenu.introduction = false;

    switch (menuNum) {
      case (1):
        this.currentMenu.solutions = true;
        break;
      case (2):
        this.currentMenu.technology = true;
        break;
      case (3):
        this.currentMenu.introduction = true;
        break;
      //  case (4): ------> sign in
      //  case (5): ------> administrator
    }
  }

  clickMenu(menuNum: number) {

    switch (menuNum) {
      case (1): // => soltions
        this.storageService.set('menuNum', 1);
        this.router.navigate(['/solutions']);
        break;

      case (2): // => technology
        this.storageService.set('menuNum', 2);
        this.router.navigate(['/technology']);
        break;

      case (3): // => introduction
        this.storageService.set('menuNum', 3);
        this.router.navigate(['/introduction']);
        break;

      case (4): // => sign in
        this.storageService.set('menuNum', 0);

        console.log('userInfo => ', this.storageService.get('userInfo'));

        if(this.storageService.get('userInfo') != null){
          if(this.storageService.fnGetUserSequenceNumber() > 1000){
            this.router.navigate(['/dashboard']);
          }
          else {
            this.router.navigate(['/administrator']);
          }
        }
        else {
          this.router.navigate(['/signin']);
        }
        break;
        
      case (5): // => administrator
        this.storageService.set('menuNum', 0);
        this.router.navigate(['/signin']);
        break;
    }
  }
}