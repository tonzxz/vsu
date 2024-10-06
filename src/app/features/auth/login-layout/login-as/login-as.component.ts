import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { UserService, User, KioskUser } from '../../../../services/user.service';
import { UswagonAuthModule, UswagonAuthService } from 'uswagon-auth';
import { environment } from '../../../../../environment/environment';
import { UswagonCoreService } from 'uswagon-core';

@Component({
  selector: 'app-login-as',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, UswagonAuthModule],
  templateUrl: './login-as.component.html',
  styleUrls: ['./login-as.component.css']
})
export class LoginAsComponent implements OnInit {
  username: string = '';
  password: string = '';
  kioskCode: string = '';
  selectedRole: string = '';
  returnUrl: string = '/';
  errorMessage: string = '';

  backgroundImageUrl: string = 'https://cdn.builder.io/api/v1/image/assets/TEMP/4a5c72fd598e49614aaa41b6e88bd5f08fef538407efee83459a593d2d0e5a55?placeholderIfAbsent=true&apiKey=f35c25b17acb406083beeda46a28c843';

  constructor(
    private route: ActivatedRoute,
    private auth:UswagonAuthService,
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.selectedRole = this.route.snapshot.queryParams['role'] || '';
    this.auth.initialize({api:environment.api, apiKey: environment.apiKey, loginTable:['users'],
      app:environment.app, 
        redirect:{
          'admin': '/admin',
          'desk_attendant': '/desk_attendant',
        }
    });


  }
  getLoginAs(): string {

    return this.selectedRole.charAt(0).toUpperCase() + this.selectedRole.slice(1);
  }
}
