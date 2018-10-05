import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { WebStorageModule } from 'ngx-store';

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
import { ForgotPasswordVerificationCodeComponent } from './forLogin/forgot-password-verification-code/forgot-password-verification-code.component';
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
import { TimerComponent } from './timer/timer.component';
import { Header } from 'src/app/header';
import { AdminMainComponent } from './main/administrator/contents/admin-main/admin-main.component';
import { TemperatureComponent } from './components/temperature/temperature.component';
import { AirDataComponent } from './components/air-data/air-data.component';
import { AirMapsComponent } from './components/air-maps/air-maps.component';
import { MapClusteringComponent } from './components/map-clustering/map-clustering.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ForgotPasswordComponent,
    ForgotPasswordVerificationCodeComponent,
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
    TimerComponent,
    AdminMainComponent,
    TemperatureComponent,
    AirDataComponent,
    AirMapsComponent,
    MapClusteringComponent,
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
    SensorDeregistrationDialog
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
