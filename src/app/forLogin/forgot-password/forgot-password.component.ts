import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/services/httpRequest/user-management.service';
import { DataManagementService } from '../../services/data-management.service';

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
    private dataService: DataManagementService) {
    this.forgotpwForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[_a-zA-Z0-9-\\.]+@[\\.a-zA-Z0-9-]+\\.[a-zA-Z]+$")]],
      birthdate: ['', Validators.required],
    });
  }

  ngOnInit() { }


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
  onSubmit() {
    if (this.forgotpwForm.invalid) console.log('Input again');

    var payload: any = {
      bdt: this.forgotpwForm.value['birthdate'].getTime().toString(),
      userId: this.forgotpwForm.value['email'],
      userFn: this.forgotpwForm.value['firstname'],
      userLn: this.forgotpwForm.value['lastname'],
    }

    /** HTTP REQUEST */
    this.umService.FPU(payload ,(success)=>{
      if (!success) {
        alert('Failed');
      }
    });
  }


}
