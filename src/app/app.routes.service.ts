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
import { UserChangePasswordComponent } from './main/dashboard/contents/user-change-password/user-change-password.component';
import { SensorManagementComponent } from './main/dashboard/contents/sensor/sensor-management/sensor-management.component';
import { PersonalSensorRegComponent } from './main/dashboard/contents/sensor/personal-sensor-reg/personal-sensor-reg.component';
import { AdminSensorManagementComponent } from './main/administrator/contents/sensor/admin-sensor-management/admin-sensor-management.component';
import { UsersManagementComponent } from './main/administrator/contents/users-management/users-management.component';
import { AdminMainComponent } from './main/administrator/contents/admin-main/admin-main.component';
import { DeregisterAccountComponent } from './main/dashboard/contents/deregister-account/deregister-account.component';
import { AirSensorHistoryComponent } from './main/dashboard/contents/air-sensor-history/air-sensor-history.component';
import { HeartHistoryComponent } from './main/dashboard/contents/heart-history/heart-history.component';
import { AdminSensorListComponent } from './main/administrator/contents/sensor/admin-sensor-list/admin-sensor-list.component';
import { AdminPersonalSensorRegistrationComponent } from './main/administrator/contents/sensor/admin-personal-sensor-registration/admin-personal-sensor-registration.component';
import { AdminAirSensorHistoryComponent } from './main/administrator/contents/admin-air-sensor-history/admin-air-sensor-history.component';
import { AdminHeartHistoryComponent } from './main/administrator/contents/admin-heart-history/admin-heart-history.component';
import { AdminChangepwComponent } from './main/administrator/contents/admin-changepw/admin-changepw.component';
import { TestComponent } from './main/test/test.component';
import { SensorHistoryComponent } from './main/dashboard/contents/sensor-history/sensor-history.component';
import { AdminSensorHistoryComponent } from './main/administrator/contents/admin-sensor-history/admin-sensor-history.component';
import { AdminDeregisterAccountComponent } from './main/administrator/contents/admin-deregister-account/admin-deregister-account.component';

export const routes: Routes = [
  {
    path: 'test',
    component: TestComponent,
  },
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
        path: 'changepw',
        component: UserChangePasswordComponent
      },
      {
        path: 'deregister-account',
        component: DeregisterAccountComponent
      },
      {
        path: 'sensor-list',
        component: SensorManagementComponent
      },
      {
        path: 'personal-sensor-management',
        component: PersonalSensorRegComponent
      },
      {
        path: 'air-history',
        component: AirSensorHistoryComponent
      },
      {
        path: 'heart-history',
        component: HeartHistoryComponent
      },
      {
        path: 'sensor-history',
        component: SensorHistoryComponent
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
        path: 'changepw',
        component: AdminChangepwComponent
      },
      {
        path: 'sensor-list',
        component: AdminSensorListComponent
      },
      {
        path: 'deregister-account',
        component: AdminDeregisterAccountComponent
      },
      {
        path: 'personal-sensor-management',
        component: AdminPersonalSensorRegistrationComponent
      },
      {
        path: 'air-history',
        component: AdminAirSensorHistoryComponent
      },
      {
        path: 'heart-history',
        component: AdminHeartHistoryComponent
      },
      {
        path: 'admin-sensor-management',
        component: AdminSensorManagementComponent
      },
      {
        path: 'admin-user-management',
        component: UsersManagementComponent
      },
      {
        path: 'sensor-history',
        component: AdminSensorHistoryComponent
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
  imports: [
    RouterModule.forRoot(
      routes, 
      { scrollPositionRestoration: 'top' }
      )
    ],
  exports: [RouterModule]
})
export class AppRoutes { }
