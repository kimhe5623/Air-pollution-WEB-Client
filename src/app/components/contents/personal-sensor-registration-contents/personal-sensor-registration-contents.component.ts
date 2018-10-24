import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SensorManagementService } from 'src/app/services/httpRequest/sensor-management.service';

@Component({
  selector: 'app-personal-sensor-registration-contents',
  templateUrl: './personal-sensor-registration-contents.component.html',
  styleUrls: ['./personal-sensor-registration-contents.component.css']
})
export class PersonalSensorRegistrationContentsComponent implements OnInit {
  wifi_mac: FormControl;
  cellular_mac: FormControl;
  constructor(
    private smService: SensorManagementService
  ) {
    this.wifi_mac = new FormControl('', [Validators.required, Validators.pattern("^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$")]);
    this.cellular_mac = new FormControl('', [Validators.required, Validators.pattern("^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$")]);
  }

  ngOnInit() {
    this.wifi_mac.setValue(null);
    this.cellular_mac.setValue(null);
  }

  onSubmit(){
    var payload = {
      mac: this.wifi_mac.value,
      cellularMac: this.cellular_mac.value,
    }
    
    var success: boolean = this.smService.SRG(payload);

    if(!success){
      alert('Failed!');
    }
    else  this.ngOnInit();
  }

}
