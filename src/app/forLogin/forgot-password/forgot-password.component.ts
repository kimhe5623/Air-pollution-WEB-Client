import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/services/httpRequest/user-management.service';
import { AuthorizationService } from '../../services/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  hide: boolean = true;
  forgotpwForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private umService: UserManagementService,
    private authService: AuthorizationService,
    private router: Router
    ) {
    this.forgotpwForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[_a-zA-Z0-9-\\.]+@[\\.a-zA-Z0-9-]+\\.[a-zA-Z]+$")]],
      birthdate: ['', Validators.required],
    });
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


  /** Form Error MSGs */
  getRequiredErrorMessage() {
    return 'The field is required';
  }
  getBirthdateErrorMessage() {
    return 'Please choose your birth date';
  }
  getEmailErrorMessage() {
    return this.forgotpwForm.get('email').hasError('required') ? 'The field is required' :
      this.forgotpwForm.get('email').hasError('pattern') ? 'Not a valid email' :
        '';
  }


  /** Event functions */
  fnOnSubmitFpuForm() {
    if (this.forgotpwForm.invalid) console.log('Input again');

    var payload: any = {
      bdt: this.forgotpwForm.value['birthdate'].getTime().toString(),
      userId: this.forgotpwForm.value['email'],
      userFn: this.forgotpwForm.value['firstname'],
      userLn: this.forgotpwForm.value['lastname'],
    }

    /** HTTP REQUEST */
    this.umService.fnFpu(payload);
  }


}
