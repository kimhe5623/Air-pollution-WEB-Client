import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/services/httpRequest/user-management.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { HEADER } from 'src/app/header';
import { AuthorizationService } from 'src/app/services/authorization.service';

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
    private storageService: StorageService,
    private authService: AuthorizationService
  ) {
    this.currentPassword = new FormControl('', Validators.required);
    this.newPassword = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16), Validators.pattern("^(?=.*[0-9])(?=.*[!@.#$%^&*?_~])(?=.*[a-zA-Z])([a-zA-Z0-9!@.#$%^&*?_~]+)$")]);
  }

  ngOnInit() {
    this.initData();
  }
  initData() {
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
      this.newPassword.hasError('minlength') ? 'Password must consist of over 6 characters' :
      this.newPassword.hasError('maxlength') ? 'Password must consist of within 16 characters' :
      this.newPassword.hasError('pattern') ? 'Password must contain at least one special character and number' : '';
  }

  fnOnSubmitUpcForm() {
    this.errorhide = false;

    if (!this.currentPassword.invalid && !this.newPassword.invalid) {

      var payload = {
        nsc: this.storageService.fnGetNumberOfSignedInCompletions(),
        curPw: this.currentPassword.value,
        newPw: this.newPassword.value,
      }

      this.umService.fnUpc(payload);
    }
  }

  clickDeregister() {
    if (this.authService.isAdministor(this.storageService.fnGetUserSequenceNumber())) {
      this.router.navigate([HEADER.ROUTER_PATHS.ADMIN_DEREGISTER_ACCOUNT], { skipLocationChange: true });
    }
    else {
      this.router.navigate([HEADER.ROUTER_PATHS.COMMON_USER_DEREGISTER_ACCOUNT], { skipLocationChange: true });
    }
  }

}