import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/services/httpRequest/user-management.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-user-change-password-contents',
  templateUrl: './user-change-password-contents.component.html',
  styleUrls: ['./user-change-password-contents.component.css']
})
export class UserChangePasswordContentsComponent implements OnInit {
  currentPassword: FormControl;
  newPassword: FormControl;
  hide: boolean;
  errorhide: boolean;

  constructor(
    private umService: UserManagementService,
    private router: Router,
    private storageService: StorageService
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
        nsc: this.storageService.get('userInfo').nsc,
        curPw: this.currentPassword.value,
        newPw: this.newPassword.value,
      }

      var success: boolean = this.umService.UPC(payload);

      if (!success) {
        alert('Failed!');
      }
      else this.ngOnInit();
    }
  }

  clickDeregister() {
    this.router.navigate([`/dashboard/deregister-account`], { skipLocationChange: true });
  }

}