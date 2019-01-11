import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserManagementService } from '../../services/httpRequest/user-management.service';
import { HEADER } from 'src/app/header';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, OnDestroy {

  hide: boolean = true;
  errorhide: boolean = true;
  signinForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private umService: UserManagementService) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[_a-zA-Z0-9-\\.]+@[\\.a-zA-Z0-9-]+\\.[a-zA-Z]+$")]],
      password: ['', Validators.required]
    })
  }

  ngOnInit() {
    console.log('sign-in.component ngOnInit()');
  }

  ngOnDestroy(){
    console.log('sign-in.component ngOnDestroy()');
  }

  getPasswordErrorMessage() {
    return 'The field is required'
  }
  getEmailErrorMessage() {
    return this.signinForm.get('email').hasError('required') ? 'The field is required' :
      this.signinForm.get('email').hasError('pattern') ? 'Not a valid email' :
        '';
  }

  onSubmitSigninForm() {
    console.log('Before click: ', HEADER.CURRENT_STATE);
    HEADER.CURRENT_STATE++;
    console.log('After click: ', HEADER.CURRENT_STATE);
    this.errorhide = false;

    if (this.signinForm.invalid) console.log('Input again');
    else {
      var payload: any = {
        userId: this.signinForm.value.email,
        userPw: this.signinForm.value.password,
      };

      /** HTTP REQUEST */
      this.umService.fnSgi(payload);
    }
  }
}
