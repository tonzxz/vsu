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
    private API:UswagonCoreService,
  ) {}

 ngOnInit() {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.selectedRole = this.route.snapshot.queryParams['role'] || '';
    if(this.selectedRole ==  'desk_attendants'){
      this.auth.initialize({api:environment.api, apiKey: environment.apiKey, loginTable:['desk_attendants'],
        app:environment.app, 
          redirect:  {'desk_attendants': '/desk-attendant/dashboard',}
  
      });
    }else{
      this.auth.initialize({api:environment.api, apiKey: environment.apiKey, loginTable:['administrators'],
        app:environment.app, 
          redirect:{
            'superadmin': '/admin/dashboard',
            'registrar': '/admin/dashboard',
            'accountant': '/admin/dashboard',
            'cashier': '/admin/dashboard',
          } 
  
      });
    }
    


  }
  getLoginAs(): string {
    return this.selectedRole.charAt(0).toUpperCase() + this.selectedRole.slice(1);
  }

  async test(){
    // INITIALIZE CORE FORM
    this.API.initializeForm(['lastname','password'])
    // PLACE VALUE TO FORM
    this.API.handleFormValue('lastname', 'Belga');
    this.API.handleFormValue('password', 'test');
    // QUERY
    const data = await  this.API.read({
      selectors: ['*'],
      tables: 'users',
      conditions:`WHERE lastname='${this.API.coreForm['lastname']}'`
    })
    // SUCCESS ERROR HANDLING
    if(data.success){
      // OUTPUT
      for(let row of data.output){
          alert(JSON.stringify(`${row.firstname} ${row.lastname}`));
      }
    }

  }
}
