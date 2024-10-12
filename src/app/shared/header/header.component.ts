import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UswagonAuthService } from 'uswagon-auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private auth:UswagonAuthService) {}

  getUserProfile(){
    return this.auth.getUser().profile ?? 'assets/images/noprofile.png';
  }
}
