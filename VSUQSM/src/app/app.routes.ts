import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

import { LoginLayoutComponent } from './features/auth/login-layout/login-layout.component';
import { LoginAsComponent } from './features/auth/login-layout/login-as/login-as.component';
import { AdminLayoutComponent } from './features/admin-layout/admin-layout.component';
import { ADashboardComponent } from './features/admin-layout/a-dashboard/a-dashboard.component';


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
        ]
      },
  ];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
