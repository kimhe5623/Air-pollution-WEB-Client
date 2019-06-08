import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/services/httpRequest/user-management.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { HEADER } from 'src/app/header';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { DisplayMessageService } from '../../../services/display-message.service';

@Component({
  selector: 'app-user-change-password-contents',
  templateUrl: './user-change-password-contents.component.html',
  styleUrls: ['./user-change-password-contents.component.css']
})
export class UserChangePasswordContentsComponent implements OnInit {
  pwchangeForm: FormGroup;
  newPasswordInfo: any = {
    pw: '',
    confirmpw: ''
  }
  hide: boolean;
  errorhide: boolean;

  constructor(
    private umService: UserManagementService,
    private router: Router,
    private storageService: StorageService,
    private authService: AuthorizationService,
    private fb: FormBuilder,
    private dispMsgService: DisplayMessageService){

    this.pwchangeForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16), Validators.pattern("^(?=.*[0-9])(?=.*[!@.#$%^&*?_~])(?=.*[a-zA-Z])([a-zA-Z0-9!@.#$%^&*?_~]+)$")]],
      confirmNewPassword: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.initData();
  }
  initData() {
    this.hide = true;
    this.errorhide = true;
    this.pwchangeForm.get('currentPassword').setValue(null);
    this.pwchangeForm.get('newPassword').setValue(null);
  }

  getCurrentPasswordErrorMessage() {
    return 'The field is required';
  }
  getNewPasswordErrorMessage() {
    return this.pwchangeForm.get('newPassword').hasError('required') ? 'The field is required' :
      this.pwchangeForm.get('newPassword').hasError('minlength') ? 'Password must consist of over 6 characters' :
      this.pwchangeForm.get('newPassword').hasError('maxlength') ? 'Password must consist of within 16 characters' :
      this.pwchangeForm.get('newPassword').hasError('pattern') ? 'Password must contain at least one special character and number' : '';
  }
  getConfirmPasswordErrorMessage() {
    return this.pwchangeForm.get('confirmNewPassword').hasError('required') ? 'The field is required' : 'It dosen\'t match with the password';
  }

  fnOnSubmitUpcForm() {
    this.errorhide = false;

    if (!this.pwchangeForm.get('currentPassword').invalid && !this.pwchangeForm.get('newPassword').invalid 
        && !this.pwchangeForm.get('confirmNewPassword').invalid) {

      if(this.pwchangeForm.get('currentPassword').value == this.pwchangeForm.get('newPassword').value){
        this.dispMsgService.fnDispErrorString('ALREADY_USED_PW');
      }
      
      else {
        var payload = {
          nsc: this.storageService.fnGetNumberOfSignedInCompletions(),
          curPw: this.pwchangeForm.get('currentPassword').value,
          newPw: this.pwchangeForm.get('newPassword').value,
        }
  
        this.umService.fnUpc(payload);
      }
    }
  }

  clickDeregister() {
    if (this.authService.isAdministor()) {
      this.router.navigate([HEADER.ROUTER_PATHS.ADMIN_DEREGISTER_ACCOUNT], { skipLocationChange: true });
    }
    else {
      this.router.navigate([HEADER.ROUTER_PATHS.COMMON_USER_DEREGISTER_ACCOUNT], { skipLocationChange: true });
    }
  }

}