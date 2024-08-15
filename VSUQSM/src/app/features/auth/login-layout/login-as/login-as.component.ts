import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from "../../../../shared/sidebar/sidebar.component";

@Component({
  selector: 'app-login-as',
  standalone: true,
  imports: [RouterModule, SidebarComponent],
  templateUrl: './login-as.component.html',
  styleUrl: './login-as.component.css'
})
export class LoginAsComponent {

}
