import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/services/httpRequest/user-management.service';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.css']
})
export class UserChangePasswordComponent implements OnInit {
  currentPassword: FormControl;
  newPassword: FormControl;
  hide: boolean;
  errorhide: boolean;

  constructor(
    private umService: UserManagementService
  ) {
    this.currentPassword = new FormControl('', Validators.required);
    this.newPassword = new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9!@.#$%^&*?_~]{6,16}$")]);
  }

  ngOnInit() {
    this.hide = true;
    this.errorhide = true;
    this.currentPassword.setValue(null);
    this.newPassword.setValue(null);
  }

  getCurrentPasswordErrorMessage() {
    return 'The field is required';
  }
  getNewPasswordErrorMessage() {
    return this.newPassword.hasError('required') ? 'The field is required' :
      this.newPassword.hasError('pattern') ? 'Password must contain at least one special character' : '';
  }

  onSubmit() {
    this.errorhide = false;

    if (!this.currentPassword.invalid && !this.newPassword.invalid) {
      
      var payload = {
        currentPassword: this.currentPassword.value,
        newPassword: this.newPassword.value,
      }

      var success: boolean = this.umService.UPC(payload);

      if (!success) {
        alert('Failed!');
      }
      else this.ngOnInit();

    }
  }

}
