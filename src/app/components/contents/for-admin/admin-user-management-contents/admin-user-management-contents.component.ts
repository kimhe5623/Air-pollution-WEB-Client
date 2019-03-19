import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { UserManagementService } from '../../../../services/httpRequest/user-management.service';
import { StorageService } from '../../../../services/storage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HEADER } from 'src/app/header';

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
      nsc: this.storageService.fnGetNumberOfSignedInCompletions(),
    }
    this.reqData(payload);

  }

  /**
   * Request data from server and set it to USER_LIST variable
   */
  reqData(payload: any) {
    this.umService.fnAuv(payload, (result) => {

      if (result != HEADER.NULL_VALUE) {

        this.existUser = result.payload.length != 0 ? true : false;

        this.USER_LIST = [];
        for (var i = 0; i < result.payload.userInfoListEncodings.length; i++) {
          this.USER_LIST.push({
            no: i + 1,
            userID: result.payload.userInfoListEncodings[i].userId,
            firstname: result.payload.userInfoListEncodings[i].fn,
            lastname: result.payload.userInfoListEncodings[i].ln,
            membershipLevel: result.payload.userInfoListEncodings[i].ml,
            membershipExpDate: result.payload.userInfoListEncodings[i].mxdt,
            registrationState: result.payload.userInfoListEncodings[i].regf,
            signinState: result.payload.userInfoListEncodings[i].wsignf && result.payload.userInfoListEncodings[i].asignf ? 3 :
              result.payload.userInfoListEncodings[i].wsignf ? 2 :
                result.payload.userInfoListEncodings[i].asignf ? 1 : 0
          });
        }
      }

      this.dataSource = new MatTableDataSource<PeriodicElement>(this.USER_LIST);
      this.dataSource.paginator = this.paginator;
    });
  }

  /** Search */

  /**
   * Add search option
   */
  fnAddSearchOption() {
    this.search_options_json[this.searchForm.value.option] = this.searchForm.value.input;
    this.jsonToArray(this.search_options_json);

    var payload: any = {
      nsc: this.storageService.fnGetNumberOfSignedInCompletions(),
      regf: this.search_options_json['registrationState'] == HEADER.NULL_VALUE ? "" : this.search_options_json['registrationState'],
      signf: this.search_options_json['signinState'] == HEADER.NULL_VALUE ? "" : this.search_options_json['signinState'],
      ml: this.search_options_json['membershipLevel'] == HEADER.NULL_VALUE ? "" : this.search_options_json['membershipLevel'],
      mxdt: this.search_options_json['membershipExpDate'] == HEADER.NULL_VALUE ? "" : this.search_options_json['membershipExpDate'],
      userId: this.search_options_json['userID'] == HEADER.NULL_VALUE ? "" : this.search_options_json['userID'],
      userFn: this.search_options_json['firstname'] == HEADER.NULL_VALUE ? "" : this.search_options_json['firstname'],
      userLn: this.search_options_json['lastname'] == HEADER.NULL_VALUE ? "" : this.search_options_json['lastname']
    }
    this.reqData(payload);
  }

  /**
   * @param key : The key of option which you want to delete
   */
  fnDeleteSearchOption(key: string) {
    delete this.search_options_json[key];
    this.jsonToArray(this.search_options_json);

    var payload: any = {
      nsc: this.storageService.fnGetNumberOfSignedInCompletions(),
      regf: this.search_options_json['registrationState'] == HEADER.NULL_VALUE ? "" : this.search_options_json['registrationState'],
      signf: this.search_options_json['signinState'] == HEADER.NULL_VALUE ? "" : this.search_options_json['signinState'],
      ml: this.search_options_json['membershipLevel'] == HEADER.NULL_VALUE ? "" : this.search_options_json['membershipLevel'],
      mxdt: this.search_options_json['membershipExpDate'] == HEADER.NULL_VALUE ? "" : this.search_options_json['membershipExpDate'],
      userId: this.search_options_json['userID'] == HEADER.NULL_VALUE ? "" : this.search_options_json['userID'],
      userFn: this.search_options_json['firstname'] == HEADER.NULL_VALUE ? "" : this.search_options_json['firstname'],
      userLn: this.search_options_json['lastname'] == HEADER.NULL_VALUE ? "" : this.search_options_json['lastname']
    }
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
