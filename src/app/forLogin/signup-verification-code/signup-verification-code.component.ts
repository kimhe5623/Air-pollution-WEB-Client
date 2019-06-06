import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HEADER } from 'src/app/header';
import { UserManagementService } from 'src/app/services/httpRequest/user-management.service';
import { DisplayMessageService } from 'src/app/services/display-message.service';
import { StateMachineManagementService } from 'src/app/services/state-machine-management.service';

@Component({
  selector: 'app-signup-verification-code',
  templateUrl: './signup-verification-code.component.html',
  styleUrls: ['./signup-verification-code.component.css']
})
export class SignupVerificationCodeComponent implements OnInit, OnDestroy {
  email: string;
  verificationCode: string;
  tci: number;
  vfc: any = [];
  timerStyle: any = { 'badge': true, 'secondary': true, 'font10': true, 'margin-top10': true };
  settedTime: number;
  sub: any;

  timerDisplay: boolean;

  vfcFormControl: FormControl;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private umService: UserManagementService,
    private dispMsgService: DisplayMessageService,
    private stateService: StateMachineManagementService
  ) {
    this.route.params.subscribe(params => {
      this.tci = Number(params['tci']);
      this.email = params['email'];
      this.verificationCode = params['vfc'];
    })
  }

  ngOnInit() {
    this.timerDisplay = true;

    this.settedTime = HEADER.TIMER.T551/1000;
    this.vfcFormControl = new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(16)])

    for (var i = 0; i < this.verificationCode.length; i++) {
      this.vfc.push(this.verificationCode.charAt(i));
    }
  }

  ngOnDestroy(){
    this.timerDisplay = false;
  }

  getCodeErrorMessage() {
    return this.vfcFormControl.hasError('required') ? 'The field is required' : 'Not a valid code';
  }

  fnTimeout() {
      this.dispMsgService.fnDispErrorString('TIMEOUT');
      this.stateService.fnStateOfUsnTransitChange(0, 0, 0, 'T551');
      this.router.navigate([HEADER.ROUTER_PATHS.SIGN_UP]);
  }

  fnOnSubmitForVerifyingCode() {
    var payload: any = {
      vc: this.verificationCode,
      ac: this.vfcFormControl.value,
    }

    /** HTTP REQUEST */
    this.umService.fnUvc(payload, this.tci);
  }
}
