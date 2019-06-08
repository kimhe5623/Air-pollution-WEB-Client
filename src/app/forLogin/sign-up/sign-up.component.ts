import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/services/httpRequest/user-management.service';
import { AuthorizationService } from '../../services/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  hide: boolean = true;
  signupForm: FormGroup;
  passwordInfo: any = {
    pw: '',
    confirmpw: ''
  };
  genderOptions: any = ['Female', 'Male', 'Other'];


  constructor(
    private fb: FormBuilder,
    private umService: UserManagementService,
    private authService: AuthorizationService,
    private router: Router
    ) {
    this.signupForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[_a-zA-Z0-9-\\.]+@[\\.a-zA-Z0-9-]+\\.[a-zA-Z]+$")]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16), Validators.pattern("^(?=.*[0-9])(?=.*[!@.#$%^&*?_~])(?=.*[a-zA-Z])([a-zA-Z0-9!@.#$%^&*?_~]+)$")]],
      confirmPassword: ['', [Validators.required]],
      birthdate: ['', Validators.required],
      gender: ['', [Validators.required]]
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
  getPasswordErrorMessage() {
    return this.signupForm.get('password').hasError('required') ? 'The field is required' :
      this.signupForm.get('password').hasError('minlength') ? 'Password must consist of over 6 characters' :
      this.signupForm.get('password').hasError('maxlength') ? 'Password must consist of within 16 characters' :
      this.signupForm.get('password').hasError('pattern') ? 'Password must contain at least one special character and number' : '';
  }
  getConfirmPasswordErrorMessage() {
    return this.signupForm.get('confirmPassword').hasError('required') ? 'The field is required' : 'It dosen\'t match with the password';
  }
  getEmailErrorMessage() {
    return this.signupForm.get('email').hasError('required') ? 'The field is required' :
      this.signupForm.get('email').hasError('pattern') ? 'Not a valid email' :
        '';
  }


  /** Event functions */
  fnOnSubmitSignupForm() {
    if (this.signupForm.invalid) console.log('Input again');

    else {
      var payload: any = {
        bdt: this.signupForm.value['birthdate'].getTime().toString(),
        gender: this.signupForm.value['gender'],
        userId: this.signupForm.value['email'],
        userPw: this.signupForm.value['password'],
        userFn: this.signupForm.value['firstname'],
        userLn: this.signupForm.value['lastname'],
      }

      /** HTTP REQUEST */
      this.umService.fnSgu(payload);
    }
  }


}
