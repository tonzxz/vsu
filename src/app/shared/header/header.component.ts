import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  divisionLogo?: string;
  isDropdownOpen = false;

  constructor(
    private router: Router,
    private contentService: ContentService,
    private auth: UswagonAuthService,
    private API: UswagonCoreService
  ) {}

  ngOnInit(): void {
    this.getDivisionLogo();
  }

  getUserProfile() {
    return this.auth.getUser().profile != null
      ? this.API.getFileURL(this.auth.getUser().profile)
      : 'assets/images/noprofile.png';
  }

  getUserName() {
    return this.auth.getUser().fullname ?? 'Unknown User';
  }

  async getDivisionLogo() {
    this.divisionLogo = (await this.contentService.getContentSetting())?.logo;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateToProfile(event: Event) {
    event.preventDefault(); // Prevents default anchor behavior

    // Navigate to the profile page
    this.router.navigate(['/admin/profile']).then(() => {
      this.isDropdownOpen = false; // Close the dropdown after successful navigation
    }).catch(err => {
      console.error('Navigation Error:', err); // Log any errors for debugging
    });
  }

}
