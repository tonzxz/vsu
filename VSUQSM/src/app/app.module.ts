import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AUserManagementComponent } from './features/admin-layout/a-user-management/a-user-management.component';
import { ATerminalManagementComponent } from './features/admin-layout/a-terminal-management/a-terminal-management.component';
import { CommonModule } from '@angular/common';
import { CreateAccountModalComponent } from './features/admin-layout/a-user-management/create-account-modal/create-account-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    AUserManagementComponent,
    ATerminalManagementComponent,
    CreateAccountModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule, // Ensure this is included
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}