import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import gsap from 'gsap';
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
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  divisionLogo?: string;
  isDropdownOpen = false;
  private documentClickListener: (event: MouseEvent) => void;

  @ViewChild('dropdownMenu') dropdownMenuRef: ElementRef | undefined;

  constructor(
    private router: Router,
    private contentService: ContentService,
    private auth: UswagonAuthService,
    private API: UswagonCoreService
  ) {
    this.documentClickListener = this.handleDocumentClick.bind(this);
  }

  ngOnInit(): void {
    this.getDivisionLogo();
    document.addEventListener('click', this.documentClickListener);
  }

  ngAfterViewInit(): void {
    gsap.from('header', { opacity: 0, y: -20, duration: 0.6 });
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.documentClickListener);
  }

  private handleDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (this.isDropdownOpen) {
      const dropdownMenu = this.dropdownMenuRef?.nativeElement;
      const profileButton = document.querySelector('[data-profile-button]');
      if (!dropdownMenu?.contains(targetElement) && !profileButton?.contains(targetElement)) {
        this.closeDropdown();
      }
    }
  }

  getUserProfile() {
    return this.auth.getUser().profile
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
    if (this.isDropdownOpen) {
      this.openDropdown();
    } else {
      this.closeDropdown();
    }
  }

  openDropdown() {
    const dropdownElement = this.dropdownMenuRef?.nativeElement;
    if (dropdownElement) {
      dropdownElement.classList.add('open');
      gsap.to(dropdownElement, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power3.out',
        onStart: () => {
          dropdownElement.style.zIndex = '100';
          dropdownElement.style.pointerEvents = 'auto';
          dropdownElement.style.display = 'block'; // Make sure it's visible
        }
      });
    }
  }

  closeDropdown() {
    const dropdownElement = this.dropdownMenuRef?.nativeElement;
    if (dropdownElement) {
      gsap.to(dropdownElement, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => {
          dropdownElement.classList.remove('open');
          dropdownElement.style.pointerEvents = 'none'; // Prevent interaction when hidden
          dropdownElement.style.zIndex = '1';
          dropdownElement.style.display = 'none'; // Hide completely after animation
        }
      });
    }
    this.isDropdownOpen = false;
  }


  navigateToProfile(event: Event) {
    event.preventDefault();
    this.router.navigate(['/admin/profile'])
      .then(() => this.closeDropdown())
      .catch(err => console.error('Navigation Error:', err));
  }
}

