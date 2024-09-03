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

  // Stores the entered code for kiosk access
  enteredCode: string = '';

  // Inject the Router and UserService in the constructor for navigation and user validation
  constructor(private router: Router, private userService: UserService) {}

  // Handles form submission to validate the kiosk access code
  onSubmit() {
    // Retrieve user details by matching the entered code with a password in UserService
    const user = this.userService.getUserByPassword(this.enteredCode);
    
    // Check if the user is valid and if their type is 'kiosk'
    if (user && user.type.toLowerCase() === 'kiosk') {
      // If valid, navigate to the corresponding forms page based on the user's department
      this.navigateToForms(user.department);
    } else {
      // Show an alert if the entered code is invalid
      alert('Invalid code. Please try again.');
    }
  }

  // Navigates to the kiosk forms page, passing the department as a query parameter
  navigateToForms(department: string) {
    this.router.navigate(['/kiosk-forms'], { queryParams: { department: department } });
  }
}
