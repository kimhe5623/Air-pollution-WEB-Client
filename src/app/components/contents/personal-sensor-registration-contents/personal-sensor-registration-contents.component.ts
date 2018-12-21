import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SensorManagementService } from 'src/app/services/httpRequest/sensor-management.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-personal-sensor-registration-contents',
  templateUrl: './personal-sensor-registration-contents.component.html',
  styleUrls: ['./personal-sensor-registration-contents.component.css']
})
export class PersonalSensorRegistrationContentsComponent implements OnInit {
  wifi_mac: FormControl;
  cellular_mac: FormControl;
  constructor(
    private storageService: StorageService,
    private smService: SensorManagementService
  ) {
    this.wifi_mac = new FormControl('', [Validators.required, Validators.pattern("^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$")]);
    this.cellular_mac = new FormControl('', [Validators.required, Validators.pattern("^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$")]);
  }

  ngOnInit() {
    this.fnInitData();
  }

  fnInitData(){
    this.wifi_mac.setValue(null);
    this.cellular_mac.setValue(null);
  }

  fnOnSubmitSrgForm(){
    var payload = {
      nsc: this.storageService.fnGetNumberOfSignedInCompletions(),
      wmac: this.wifi_mac.value,
      cmac: this.cellular_mac.value,
    }
    
    this.smService.fnSrg(payload, (success)=>{
      if(success){
        this.fnInitData();
      }
    });
  }

}
