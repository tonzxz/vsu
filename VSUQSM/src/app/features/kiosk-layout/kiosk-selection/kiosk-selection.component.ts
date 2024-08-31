import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kiosk-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kiosk-selection.component.html',
  styleUrls: ['./kiosk-selection.component.css']
})
export class KioskSelectionComponent {
  enteredCode: string = '';

  constructor(private router: Router, private userService: UserService) {}

  onSubmit() {
    const user = this.userService.getUserByPassword(this.enteredCode);
    if (user && user.type.toLowerCase() === 'kiosk') {
      this.navigateToForms(user.department);
    } else {
      alert('Invalid code. Please try again.');
    }
  }

  navigateToForms(department: string) {
    this.router.navigate(['/kiosk-forms'], { queryParams: { department: department } });
  }
}