import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TIMER } from 'src/app/header';
import { UserManagementService } from 'src/app/services/httpRequest/user-management.service';

@Component({
  selector: 'app-signup-verification-code',
  templateUrl: './signup-verification-code.component.html',
  styleUrls: ['./signup-verification-code.component.css']
})
export class SignupVerificationCodeComponent implements OnInit {
  email: string;
  verificationCode: string;
  tci: string;
  vfc: any = [];
  timerStyle: any = { 'badge': true, 'badge-default': true, 'font10': true, 'margin-top10': true };
  settedTime: number;
  sub: any;

  vfcFormControl: FormControl;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private umService: UserManagementService,
  ) {
    this.route.params.subscribe(params => {
      this.tci = params['tci'];
      this.email = params['email'];
      this.verificationCode = params['vfc'];
    })
  }

  ngOnInit() {
    this.settedTime = TIMER.T551;
    this.vfcFormControl = new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(20)])

    for (var i = 0; i < this.verificationCode.length; i++) {
      this.vfc.push(this.verificationCode.charAt(i));
    }
  }

  getCodeErrorMessage() {
    return this.vfcFormControl.hasError('required') ? 'The field is required' : 'Not a valid code';
  }

  isTimeout(isTimeout: boolean) {
    if (isTimeout) {
      alert('Timeout!');
      this.router.navigate(['/signup']);
    }
  }
  onSubmit() {
    var payload: any = {
      verificationCode: this.verificationCode,
      authenticationCode: this.vfcFormControl.value,
    }
    console.log(payload);

    /** HTTP REQUEST */
    var success: boolean = this.umService.UVC(payload, this.tci);

    if (!success) {
      alert('failed!');
      this.router.navigate(['/signup']);
    }
  }
}
