import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent implements OnInit, OnDestroy {

  private contentDisplay: boolean;

  ngOnInit(){
    console.log("user-main.component.ts ngOnInit()");
    this.contentDisplay = true;
  }
  ngOnDestroy(){
    console.log("user-main.component.ts ngOnDestroy()");
    this.contentDisplay = false;
  }
  constructor(){}
}