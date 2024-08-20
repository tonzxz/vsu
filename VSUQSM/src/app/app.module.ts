import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AUserManagementComponent } from './features/admin-layout/a-user-management/a-user-management.component';
import { ATerminalManagementComponent } from './features/admin-layout/a-terminal-management/a-terminal-management.component';

@NgModule({
  declarations: [
    AppComponent,
    AUserManagementComponent,
    ATerminalManagementComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule, // Ensure this is included
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}