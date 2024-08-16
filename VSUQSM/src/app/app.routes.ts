import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

import { LoginLayoutComponent } from './features/auth/login-layout/login-layout.component';
import { LoginAsComponent } from './features/auth/login-layout/login-as/login-as.component';
import { AdminLayoutComponent } from './features/admin-layout/admin-layout.component';
import { ADashboardComponent } from './features/admin-layout/a-dashboard/a-dashboard.component';
import { DeskAttendantLayoutComponent } from './features/desk-attendant-layout/desk-attendant-layout.component';
import { DaDashboardComponent } from './features/desk-attendant-layout/da-dashboard/da-dashboard.component';
import { DaContentmanagementComponent } from './features/desk-attendant-layout/da-contentmanagement/da-contentmanagement.component';


export const routes: Routes = [
    {
      path: '',
      redirectTo: '/login',
      pathMatch: 'full'
    },
    {
        path: 'login', component: LoginLayoutComponent,
    },
    {
        path: 'login-as', component: LoginAsComponent,
    },
    {
        path: 'admin', component: AdminLayoutComponent,
        children: [
          { path: 'dashboard',component: ADashboardComponent},
          { path: 'contentmgmt',component: DaContentmanagementComponent},
        ]
      },
      {
        path: 'desk-attendant', component: DeskAttendantLayoutComponent,
        children: [
          { path: 'da-dashboard',component: DaDashboardComponent},
          { path: 'da-contentmgmt',component: DaContentmanagementComponent},
        ]
      },
  ];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
