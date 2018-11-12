import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent implements OnInit, OnDestroy {

  private contentDisplay: boolean;

  constructor(
    private storageService: StorageService,
    private router: Router
  ){}

  ngOnInit(){
    console.log("user-main.component.ts ngOnInit()");
    this.contentDisplay = true;

    if(this.storageService.get('userInfo') == null){
      this.router.navigate(['/page-not-found']);
    }
  }
  ngOnDestroy(){
    console.log("user-main.component.ts ngOnDestroy()");
    this.contentDisplay = false;
  }

}