import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { UserManagementService } from '../../../../services/httpRequest/user-management.service';
import { StorageService } from '../../../../services/storage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-user-management-contents',
  templateUrl: './admin-user-management-contents.component.html',
  styleUrls: ['./admin-user-management-contents.component.css']
})
export class AdminUserManagementContentsComponent implements OnInit {
  displayedColumns: string[] = ['no', 'userID', 'firstname', 'lastname', 'membershipLevel', 'membershipExpDate', 'registrationState', 'signinState'];

  USER_LIST: PeriodicElement[] = [];
  dataSource: MatTableDataSource<PeriodicElement>;

  search_options_array: any = [];
  search_options_json: any = {};

  existUser: boolean;

  searchForm: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private umService: UserManagementService,
    private storageService: StorageService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      hideRequired: true,
      floatLabel: 'auto',
      option: ['', Validators.required],
      input: ['', Validators.required]
    });
  }

  ngOnInit() {

    var payload = {
      nsc: this.storageService.get('userInfo').nsc
    }
    this.reqData(payload);

  }

  /**
   * Request data from server and set it to USER_LIST variable
   */
  reqData(payload: any) {
    this.umService.AUV(payload, (result) => {

      if (result != null) {

        this.existUser = result.payload.length != 0 ? true : false;

        for (var i = 0; i < result.payload.tlv.length; i++) {
          this.USER_LIST.push({
            no: i + 1,
            userID: result.payload.tlv[i].userID,
            firstname: result.payload.tlv[i].firstname,
            lastname: result.payload.tlv[i].lastname,
            membershipLevel: result.payload.tlv[i].membership_level,
            membershipExpDate: result.payload.tlv[i].membership_exp_date,
            registrationState: result.payload.tlv[i].reg_flag,
            signinState: result.payload.tlv[i].signin_state_flag
          });
        }
      }
      else alert('Failed');

      const USER_LIST_READONLY = this.USER_LIST;

      console.log(USER_LIST_READONLY);
      this.dataSource = new MatTableDataSource<PeriodicElement>(USER_LIST_READONLY);
      this.dataSource.paginator = this.paginator;

    });
  }

  /** Search */

  /**
   * Add search option
   */
  addSearchOption() {
    this.search_options_json[this.searchForm.value.option] = this.searchForm.value.input;
    this.jsonToArray(this.search_options_json);
  
    var payload: any = {
      nsc: this.storageService.get('userInfo').nsc,
      options: this.search_options_json
    }
    console.log(payload);
    this.reqData(payload);
  }

  /**
   * @param key : The key of option which you wanna delete
   */
  deleteSearchOption(key: string) {
    delete this.search_options_json[key];
    this.jsonToArray(this.search_options_json);

    var payload: any = {
      nsc: this.storageService.get('userInfo').nsc,
      options: this.search_options_json
    }

    console.log(payload);
    this.reqData(payload);
  }


  jsonToArray(json: any) {
    this.search_options_array = [];
    for (var key in json) {
      this.search_options_array.push({ key: key, value: json[key] });
    }
  }
  /**--------- */
}
export interface PeriodicElement {
  no: number,
  userID: string,
  firstname: string,
  lastname: string,
  membershipLevel: string,
  membershipExpDate: Date,
  registrationState: number,
  signinState: number
}
