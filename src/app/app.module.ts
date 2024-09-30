import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AUserManagementComponent } from './features/admin-layout/a-user-management/a-user-management.component';
import { ATerminalManagementComponent } from './features/admin-layout/a-terminal-management/a-terminal-management.component';
import { CreateAccountModalComponent } from './features/admin-layout/a-user-management/create-account-modal/create-account-modal.component';
import { KioskSelectionComponent } from './features/kiosk-layout/kiosk-selection/kiosk-selection.component';
import { KioskFormsComponent } from './features/kiosk-layout/kiosk-forms/kiosk-forms.component';

// Services
import { UserService } from './services/user.service';

// Routing Module
import { AppRoutingModule } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    AUserManagementComponent,
    ATerminalManagementComponent,
    CreateAccountModalComponent,
    KioskSelectionComponent,
    KioskFormsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    AppRoutingModule  // Make sure to include the routing module
  ],
  providers: [
    UserService  // Moved to providers array
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
