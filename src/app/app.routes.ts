import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginLayoutComponent } from './features/auth/login-layout/login-layout.component'; 
import { LoginAsComponent } from './features/auth/login-layout/login-as/login-as.component';
import { AdminLayoutComponent } from './features/admin-layout/admin-layout.component';
import { ADashboardComponent } from './features/admin-layout/a-dashboard/a-dashboard.component';
import { DeskAttendantLayoutComponent } from './features/desk-attendant-layout/desk-attendant-layout.component';
import { DaDashboardComponent } from './features/desk-attendant-layout/da-dashboard/da-dashboard.component';
import { DaContentmanagementComponent } from './features/desk-attendant-layout/da-contentmanagement/da-contentmanagement.component';
import { AContentmgmtComponent } from './features/admin-layout/a-contentmgmt/a-contentmgmt.component';
import { DaTerminalmgmtComponent } from './features/desk-attendant-layout/da-terminalmgmt/da-terminalmgmt.component';
import { KioskSelectionComponent } from './features/kiosk-layout/kiosk-selection/kiosk-selection.component';
import { KioskFormsComponent } from './features/kiosk-layout/kiosk-forms/kiosk-forms.component';
import { QueueSelectionComponent } from './features/queueing-layout/queue-selection/queue-selection.component';
import { QueueDisplayComponent } from './features/queueing-layout/queue-display/queue-display.component';
import { AUserManagementComponent } from './features/admin-layout/a-user-management/a-user-management.component';
import { ATerminalManagementComponent } from './features/admin-layout/a-terminal-management/a-terminal-management.component';
import { AKioskManagementComponent } from './features/admin-layout/a-kiosk-management/a-kiosk-management.component';
import { AuthGuard } from './shared/auth.guard';

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
    data: { requiredRole: 'admin' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ADashboardComponent },
      { path: 'content-management', component: AContentmgmtComponent },
      { path: 'user-management', component: AUserManagementComponent },
      { path: 'terminal', component: ATerminalManagementComponent },
      { path: 'kiosk-management', component: AKioskManagementComponent },
    ]
  },
  {
    path: 'kiosk-selection', component: KioskSelectionComponent,
  },
  {
    path: 'kiosk-forms', component: KioskFormsComponent,
  },
  {
    path: 'desk-attendant',
    component: DeskAttendantLayoutComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'desk_attendants' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DaDashboardComponent },
      { path: 'contentmgmt', component: DaContentmanagementComponent },
      { path: 'terminalmgmt', component: DaTerminalmgmtComponent }
    ]
  },
  {
    path: 'queueing-selection', component: QueueSelectionComponent,
    children: [
      { path: 'display/:role', component: QueueDisplayComponent }, 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }