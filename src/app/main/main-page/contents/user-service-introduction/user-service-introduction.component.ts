import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-service-introduction',
  templateUrl: './user-service-introduction.component.html',
  styleUrls: ['./user-service-introduction.component.css']
})
export class UserServiceIntroductionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  isTimeout(isTimeout: boolean){
    console.log('timeout: ', isTimeout);
  }
}
