import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { WebStorageModule } from 'ngx-store';
import "core-js/shim";
import {} from 'markerclustererplus';

import { NgCircleProgressModule } from 'ng-circle-progress';

// MDB Angular Free
import { NavbarModule, WavesModule } from 'angular-bootstrap-md';

import { AppRoutes } from './app.routes.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import {
  /** Angular Material */
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatCardModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatListModule,
  MatStepperModule,
  MatTabsModule,
  MatTreeModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatBadgeModule,
  MatChipsModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatBottomSheetModule,
  MatDialogModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
} from '@angular/material';
/** Bootstrapmd */
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ForgotPasswordComponent } from './forLogin/forgot-password/forgot-password.component';
import { SignInComponent } from './forLogin/sign-in/sign-in.component';
import { SignUpComponent } from './forLogin/sign-up/sign-up.component';
import { SignupVerificationCodeComponent } from './forLogin/signup-verification-code/signup-verification-code.component';
import { NavbarComponent } from './main/main-page/navbar/navbar.component';
import { HomeComponent } from './main/main-page/contents/home/home.component';
import { SolutionsComponent } from './main/main-page/contents/solutions/solutions.component';
import { TechnologyComponent } from './main/main-page/contents/technology/technology.component';
import { UserServiceIntroductionComponent } from './main/main-page/contents/user-service-introduction/user-service-introduction.component';
import { DashboardNavbarComponent } from './main/dashboard/dashboard-navbar/dashboard-navbar.component';
import { UserMainComponent } from './main/dashboard/contents/user-main/user-main.component';
import { UserProfileComponent } from './main/dashboard/contents/user-profile/user-profile.component';
import { UserChangePasswordComponent } from './main/dashboard/contents/user-change-password/user-change-password.component';
import { DashboardFooterComponent } from './main/dashboard/dashboard-footer/dashboard-footer.component';
import { AdminNavbarComponent } from './main/administrator/admin-navbar/admin-navbar.component';
import { AdminFooterComponent } from './main/administrator/admin-footer/admin-footer.component';
import { UsersManagementComponent } from './main/administrator/contents/users-management/users-management.component';
import { AdminSensorManagementComponent } from './main/administrator/contents/sensor/admin-sensor-management/admin-sensor-management.component';
import { SensorManagementComponent } from './main/dashboard/contents/sensor/sensor-management/sensor-management.component';
import { PersonalSensorRegComponent } from './main/dashboard/contents/sensor/personal-sensor-reg/personal-sensor-reg.component';
import { SensorDeletionDialog } from './dialogs/sensor-deletion-dialog/sensor-deletion-dialog';
import { SensorAssociationDialog } from './dialogs/sensor-association-dialog/sensor-association-dialog';
import { SensorDeregistrationDialog } from './dialogs/sensor-deregistration-dialog/sensor-deregistration-dialog';
import { UserDeregistrationConfirmDialog } from './dialogs/user-deregistration-confirm-dialog/user-deregistration-confirm-dialog';
import { Header } from 'src/app/header';
import { AdminMainComponent } from './main/administrator/contents/admin-main/admin-main.component';
import { TemperatureComponent } from './components/temperature/temperature.component';
import { AirDataComponent } from './components/air-data/air-data.component';
import { AirMapsComponent } from './components/air-maps/air-maps.component';
import { DeregisterAccountComponent } from './main/dashboard/contents/deregister-account/deregister-account.component';
import { AirSensorHistoryComponent } from './main/dashboard/contents/air-sensor-history/air-sensor-history.component';
import { HeartHistoryComponent } from './main/dashboard/contents/heart-history/heart-history.component';
import { SensorMapsComponent } from './components/sensor-maps/sensor-maps.component';
import { AirSensorHistoryContentsComponent } from './components/contents/air-sensor-history-contents/air-sensor-history-contents.component';
import { DeregisterAccountContentsComponent } from './components/contents/deregister-account-contents/deregister-account-contents.component';
import { HeartHistoryContentsComponent } from './components/contents/heart-history-contents/heart-history-contents.component';
import { PersonalSensorRegistrationContentsComponent } from './components/contents/personal-sensor-registration-contents/personal-sensor-registration-contents.component';
import { SensorManagementContentsComponent } from './components/contents/sensor-management-contents/sensor-management-contents.component';
import { UserChangePasswordContentsComponent } from './components/contents/user-change-password-contents/user-change-password-contents.component';
import { UserMainContentsComponent } from './components/contents/user-main-contents/user-main-contents.component';
import { AdminUserManagementContentsComponent } from './components/contents/for-admin/admin-user-management-contents/admin-user-management-contents.component';
import { AdminSensorManagementContentsComponent } from './components/contents/for-admin/admin-sensor-management-contents/admin-sensor-management-contents.component';
import { AdminProfileComponent } from './main/administrator/contents/admin-profile/admin-profile.component';
import { AdminChangepwComponent } from './main/administrator/contents/admin-changepw/admin-changepw.component';
import { AdminHeartHistoryComponent } from './main/administrator/contents/admin-heart-history/admin-heart-history.component';
import { AdminDeregisterAccountComponent } from './main/administrator/contents/admin-deregister-account/admin-deregister-account.component';
import { AdminPersonalSensorRegistrationComponent } from './main/administrator/contents/sensor/admin-personal-sensor-registration/admin-personal-sensor-registration.component';
import { AdminSensorListComponent } from './main/administrator/contents/sensor/admin-sensor-list/admin-sensor-list.component';
import { AdminAirSensorHistoryComponent } from './main/administrator/contents/admin-air-sensor-history/admin-air-sensor-history.component';
import { AmchartTestComponent } from './components/amchart-test/amchart-test.component';
import { TestComponent } from './main/test/test.component';
import { AmchartTest2Component } from './components/amchart-test2/amchart-test2.component';
import { AmchartTest3Component } from './components/amchart-test3/amchart-test3.component';
import { KasDialog } from './dialogs/kas-dialog/kas-dialog';
import { KasService } from './services/kas.service';
import { TimerComponent } from './components/timer/timer.component';
import { HistoricalAirChartComponent } from './components/chart/historical-air-chart/historical-air-chart.component';
import { HistoricalHeartChartComponent } from './components/chart/historical-heart-chart/historical-heart-chart.component';
import { AmchartTest4Component } from './components/amchart-test4/amchart-test4.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ForgotPasswordComponent,
    SignInComponent,
    SignUpComponent,
    SignupVerificationCodeComponent,
    NavbarComponent,
    HomeComponent,
    SolutionsComponent,
    TechnologyComponent,
    UserServiceIntroductionComponent,
    DashboardNavbarComponent,
    UserMainComponent,
    UserProfileComponent,
    UserChangePasswordComponent,
    DashboardFooterComponent,
    AdminNavbarComponent,
    AdminFooterComponent,
    UsersManagementComponent,
    AdminSensorManagementComponent,
    SensorManagementComponent,
    PersonalSensorRegComponent,
    SensorAssociationDialog,
    SensorDeletionDialog,
    SensorDeregistrationDialog,
    UserDeregistrationConfirmDialog,
    KasDialog,
    AdminMainComponent,
    TemperatureComponent,
    AirDataComponent,
    AirMapsComponent,
    DeregisterAccountComponent,
    AirSensorHistoryComponent,
    HeartHistoryComponent,
    SensorMapsComponent,
    AirSensorHistoryContentsComponent,
    DeregisterAccountContentsComponent,
    HeartHistoryContentsComponent,
    PersonalSensorRegistrationContentsComponent,
    SensorManagementContentsComponent,
    UserChangePasswordContentsComponent,
    UserMainContentsComponent,
    AdminUserManagementContentsComponent,
    AdminSensorManagementContentsComponent,
    AdminProfileComponent,
    AdminChangepwComponent,
    AdminHeartHistoryComponent,
    AdminDeregisterAccountComponent,
    AdminPersonalSensorRegistrationComponent,
    AdminSensorListComponent,
    AdminAirSensorHistoryComponent,
    AmchartTestComponent,
    TestComponent,
    AmchartTest2Component,
    AmchartTest3Component,
    TimerComponent,
    HistoricalAirChartComponent,
    HistoricalHeartChartComponent,
    AmchartTest4Component,
  ],
  imports: [
    /** Angular Modules */
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),

    WebStorageModule,

    /** MDB */
    MDBBootstrapModule.forRoot(),
    NavbarModule, WavesModule,

    /** Angular Material Modules */
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatStepperModule,
    MatTabsModule,
    MatTreeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,

    /** Router*/
    AppRoutes,

    /** Header */
    Header,

  ],
  entryComponents: [
    SensorAssociationDialog,
    SensorDeletionDialog,
    SensorDeregistrationDialog,
    UserDeregistrationConfirmDialog,
    KasDialog,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [KasService],
  bootstrap: [AppComponent]
})
export class AppModule { }
