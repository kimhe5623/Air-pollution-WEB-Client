import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deregister-account',
  templateUrl: './deregister-account.component.html',
  styleUrls: ['./deregister-account.component.css']
})
export class DeregisterAccountComponent implements OnInit {
  constructor(
    private storageService: StorageService,
    private router: Router){}

  ngOnInit(){
    if(this.storageService.get('userInfo') == null){
      this.router.navigate(['/page-not-found']);
    }
  }
}