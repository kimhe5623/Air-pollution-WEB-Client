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
      nsc: this.storageService.get('userInfo').nsc,
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
      else alert('Failed');

      console.log("USER LIST => ", this.USER_LIST);
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.USER_LIST);
      console.log(this.dataSource);
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
      regf: this.search_options_json['registrationState'] == null ? "" : this.search_options_json['registrationState'],
      signf: this.search_options_json['signinState'] == null ? "" : this.search_options_json['signinState'],
      ml: this.search_options_json['membershipLevel'] == null ? "" : this.search_options_json['membershipLevel'],
      mxdt: this.search_options_json['membershipExpDate'] == null ? "" : this.search_options_json['membershipExpDate'],
      userId: this.search_options_json['userID'] == null ? "" : this.search_options_json['userID'],
      userFn: this.search_options_json['firstname'] == null ? "" : this.search_options_json['firstname'],
      userLn: this.search_options_json['lastname'] == null ? "" : this.search_options_json['lastname']
    }
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
      regf: this.search_options_json['registrationState'] == null ? "" : this.search_options_json['registrationState'],
      signf: this.search_options_json['signinState'] == null ? "" : this.search_options_json['signinState'],
      ml: this.search_options_json['membershipLevel'] == null ? "" : this.search_options_json['membershipLevel'],
      mxdt: this.search_options_json['membershipExpDate'] == null ? "" : this.search_options_json['membershipExpDate'],
      userId: this.search_options_json['userID'] == null ? "" : this.search_options_json['userID'],
      userFn: this.search_options_json['firstname'] == null ? "" : this.search_options_json['firstname'],
      userLn: this.search_options_json['lastname'] == null ? "" : this.search_options_json['lastname']
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
