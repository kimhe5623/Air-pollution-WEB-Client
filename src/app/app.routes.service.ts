import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './forLogin/sign-in/sign-in.component';
import { SignUpComponent } from './forLogin/sign-up/sign-up.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ForgotPasswordComponent } from './forLogin/forgot-password/forgot-password.component';
import { SignupVerificationCodeComponent } from './forLogin/signup-verification-code/signup-verification-code.component';
import { SolutionsComponent } from './main/main-page/contents/solutions/solutions.component';
import { TechnologyComponent } from './main/main-page/contents/technology/technology.component';
import { UserServiceIntroductionComponent } from './main/main-page/contents/user-service-introduction/user-service-introduction.component';
import { HomeComponent } from './main/main-page/contents/home/home.component';
import { UserMainComponent } from './main/dashboard/contents/user-main/user-main.component';
import { UserProfileComponent } from './main/dashboard/contents/user-profile/user-profile.component';
import { UserChangePasswordComponent } from './main/dashboard/contents/user-change-password/user-change-password.component';
import { SensorManagementComponent } from './main/dashboard/contents/sensor/sensor-management/sensor-management.component';
import { PersonalSensorRegComponent } from './main/dashboard/contents/sensor/personal-sensor-reg/personal-sensor-reg.component';
import { AdminSensorManagementComponent } from './main/administrator/contents/sensor/admin-sensor-management/admin-sensor-management.component';
import { UsersManagementComponent } from './main/administrator/contents/users-management/users-management.component';
import { AdminMainComponent } from './main/administrator/contents/admin-main/admin-main.component';

export const routes: Routes = [
  {
    path: 'signin',
    component: SignInComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'signup-code/:tci/:email/:vfc',
    component: SignupVerificationCodeComponent,
  },
  {
    path: 'forgot-pw',
    component: ForgotPasswordComponent
  },
  {
    path: 'dashboard',
    children: [
      /** dashboard */
      {
        path: '',
        component: UserMainComponent
      },
      {
        path: 'profile',
        component: UserProfileComponent
      },
      {
        path: 'changepw',
        component: UserChangePasswordComponent
      },
      {
        path: 'sensor-management',
        component: SensorManagementComponent
      },
      {
        path: 'personal-sensor-management',
        component: PersonalSensorRegComponent
      }
    ]
  },

  {
    path: 'administrator',
    children: [
      /** Administrator page */
      {
        path: '',
        component: AdminMainComponent
      },
      {
        path: 'airound-umain',
        component: AdminMainComponent
      },
      {
        path: 'sensor-management',
        component: AdminSensorManagementComponent
      },
      {
        path: 'user-management',
        component: UsersManagementComponent
      }
    ]
  },

  {
    path: '',
    children: [
      /** Mainpage */
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'solutions',
        component: SolutionsComponent
      },
      {
        path: 'technology',
        component: TechnologyComponent
      },
      {
        path: 'introduction',
        component: UserServiceIntroductionComponent
      },
    ]
  },
  {
    path: 'home',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutes { }
