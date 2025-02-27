import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { UserManagementComponent } from './features/admin-layout/user-management/user-management.component';
import { TerminalManagementComponent } from './features/admin-layout/terminal-management/terminal-management.component';
import { CreateAccountModalComponent } from './features/admin-layout/user-management/create-account-modal/create-account-modal.component';
import { KioskSelectionComponent } from './features/kiosk-layout/kiosk-selection/kiosk-selection.component';
import { KioskFormsComponent } from './features/kiosk-layout/kiosk-forms/kiosk-forms.component';
import { QueueDisplayComponent } from './features/queueing-layout/queue-display/queue-display.component';

// Services
import { UserService } from './services/user.service';

// Routing Module
import { AppRoutingModule } from './app.routes';

@NgModule({
  declarations: [

  ],
  imports: [
    AppComponent,
    BrowserModule,
    FormsModule,
    CommonModule,
    AppRoutingModule  // Make sure to include the routing module
  ],
  providers: [
    UserService  // Moved to providers array
  ],

})
export class AppModule { }
