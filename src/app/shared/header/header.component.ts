import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private auth:UswagonAuthService, private API:UswagonCoreService) {}

  getUserProfile(){
    return this.auth.getUser().profile!=null ? this.API.getFileURL(this.auth.getUser().profile) : 'assets/images/noprofile.png';
  }

  getUserName(){
    return this.auth.getUser().fullname ?? 'Unknown User';
  }
}
