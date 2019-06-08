import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserManagementService } from '../../services/httpRequest/user-management.service';
import { AuthorizationService } from '../../services/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  hide: boolean = true;
  errorhide: boolean = true;
  signinForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private umService: UserManagementService,
    private authService: AuthorizationService,
    private router: Router) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[_a-zA-Z0-9-\\.]+@[\\.a-zA-Z0-9-]+\\.[a-zA-Z]+$")]],
      password: ['', Validators.required]
    })
  }

  ngOnInit() {

    if(this.authService.isUserLoggedIn()) {
      if(this.authService.isAdministor()){
        this.router.navigate(['/administrator']);
      }
      else {
        this.router.navigate(['/dashboard']);
      }
    }
    
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
    this.errorhide = false;

    if (!this.signinForm.invalid) {
      var payload: any = {
        userId: this.signinForm.value.email,
        userPw: this.signinForm.value.password,
      };

      /** HTTP REQUEST */
      this.umService.fnSgi(payload);
    }
  }
}
