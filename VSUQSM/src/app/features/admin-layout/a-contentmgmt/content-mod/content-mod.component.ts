// content-mod.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-mod', // Defines the selector for this component
  standalone: true, // Allows this component to be used independently without being part of a module
  imports: [CommonModule], // Imports necessary modules for this component
  templateUrl: './content-mod.component.html', // Path to the HTML template
  styleUrls: ['./content-mod.component.css'] // Path to the CSS styles for this component
})
export class ContentModComponent implements OnInit {
  // Holds the current date and time in a specific format
  currentDate: string = '';

  // Holds the current time as a string (HH:mm:ss format)
  timer: string = '00:00:00';

  constructor() {}

  // Lifecycle hook that gets called after the component is initialized
  ngOnInit(): void {
    this.startTimer(); // Start the timer on component initialization
    this.updateCurrentDate(); // Update the current date on component initialization
  }

  // Updates the current date every second and formats it to include year, month, day, and time
  private updateCurrentDate(): void {
    setInterval(() => {
      const now = new Date(); // Get the current date and time
      this.currentDate = now.toLocaleDateString('en-PH', {
        year: 'numeric', // Display the full year
        month: 'short', // Display the short name of the month
        day: 'numeric', // Display the day of the month
        hour: '2-digit', // Display the hour in two-digit format
        minute: '2-digit', // Display the minute in two-digit format
      });
    }, 1000); // Update the date every 1000 milliseconds (1 second)
  }

  // Starts a timer that updates every second and displays the current time in HH:mm:ss format
  private startTimer(): void {
    setInterval(() => {
      const now = new Date(); // Get the current time
      this.timer = now.toTimeString().split(' ')[0]; // Extract and format the time (HH:mm:ss)
    }, 1000); // Update the timer every 1000 milliseconds (1 second)
  }
}
