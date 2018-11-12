import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-heart-history',
  templateUrl: './heart-history.component.html',
  styleUrls: ['./heart-history.component.css']
})
export class HeartHistoryComponent implements OnInit {
  constructor(
    private storageService: StorageService,
    private router: Router){}

  ngOnInit(){
    if(this.storageService.get('userInfo') == null){
      this.router.navigate(['/page-not-found']);
    }
  }
}
