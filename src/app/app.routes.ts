import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginLayoutComponent } from './features/auth/login-layout/login-layout.component'; 
import { LoginAsComponent } from './features/auth/login-layout/login-as/login-as.component';
import { AdminLayoutComponent } from './features/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/admin-layout/dashboard/dashboard.component';
import { DeskAttendantLayoutComponent } from './features/desk-attendant-layout/desk-attendant-layout.component';
import { DaDashboardComponent } from './features/desk-attendant-layout/da-dashboard/da-dashboard.component';
import { ContentManagementComponent } from './features/admin-layout/content-management/content-management.component';
import { DaTerminalmgmtComponent } from './features/desk-attendant-layout/da-terminalmgmt/da-terminalmgmt.component';
import { KioskSelectionComponent } from './features/kiosk-layout/kiosk-selection/kiosk-selection.component';
import { KioskFormsComponent } from './features/kiosk-layout/kiosk-forms/kiosk-forms.component';
import { UserManagementComponent } from './features/admin-layout/user-management/user-management.component';
import { TerminalManagementComponent } from './features/admin-layout/terminal-management/terminal-management.component';
import { KioskManagementComponent } from './features/admin-layout/kiosk-management/kiosk-management.component';

import { AuthGuard } from './guards/auth.guard';
import { QueueingLayoutComponent } from './features/queueing-layout/queueing-layout.component';
import { KioskLayoutComponent } from './features/kiosk-layout/kiosk-layout.component';
import { kioskGuard } from './guards/kiosk.guard';

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
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'admin',  },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'content-management', component: ContentManagementComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'terminal', component: TerminalManagementComponent },
      { path: 'kiosk-management', component: KioskManagementComponent },
    ]
  },
  {
    path:'kiosk',
    component:KioskLayoutComponent,
 
    children: [
      { path: '', redirectTo: 'selection', pathMatch: 'full' },
      {
        path: 'selection', 
        canActivate: [kioskGuard],
        component: KioskSelectionComponent,
      },
      {
        path: 'forms', 
        canActivate: [kioskGuard],
        component: KioskFormsComponent,
      },
    ]
  },

  {
    path: 'desk-attendant',
    component: DeskAttendantLayoutComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'desk_attendants' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DaDashboardComponent },
      { path: 'terminalmgmt', component: DaTerminalmgmtComponent }
    ]
  },
  {
    path: 'queueing-display', component: QueueingLayoutComponent,
    // children: [
    //   { path: 'display/:role', component: QueueDisplayComponent }, 
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }