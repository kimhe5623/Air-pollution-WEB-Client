import { Component, OnInit } from '@angular/core';
import { NotiService } from '../../../../services/noti.service';

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.css']
})
export class SolutionsComponent implements OnInit {
  istrue: boolean = true;
  constructor(
    private notiService: NotiService
  ) { }

  ngOnInit() {
  }

  btnClick(n) {
    switch(n) {
      case(1):
        this.notiService.info('the requested WiFi MAC address is not an associated with user ID', 700);
        break;
      case(2):
        this.notiService.succ('Incorrect authentication code under the verification code');
        break;
      case(3):
        this.notiService.err('Anyone with access can view your invited visitors.');
        break;
      case(4):
        this.notiService.warn('Anyone with access can view your invited visitors.');
        break;
    }
  }

}
