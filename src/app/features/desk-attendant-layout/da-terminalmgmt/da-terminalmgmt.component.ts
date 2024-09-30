import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

interface Ticket {
  number: number;
  datetime: string;
  type: 'Priority' | 'Regular';
}

interface ClientDetails {
  name: string;
  date: string;
  services: {
    name: string;
    description: string;
  }[];
}

@Component({
  selector: 'app-da-terminalmgmt',
  templateUrl: './da-terminalmgmt.component.html',
  styleUrls: ['./da-terminalmgmt.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ]
})
export class DaTerminalmgmtComponent implements OnInit, OnDestroy {
  selectedCounter: number | null = null;
  counters: number[] = [1, 2, 3, 4, 5];
  currentNumber: number = 110;
  lastCalledNumber: string = 'N/A';
  currentDate: string = '';
  timer: string = '00:00:00';
  timerStartTime: number | null = null;

  tickets: Ticket[] = [
    { number: 112, datetime: '9/29/2024, 9:13:24 PM', type: 'Priority' },
    { number: 113, datetime: '9/29/2024, 9:15:10 PM', type: 'Priority' },
    { number: 114, datetime: '9/29/2024, 9:20:45 PM', type: 'Regular' },
    { number: 115, datetime: '9/29/2024, 9:25:30 PM', type: 'Regular' },
    { number: 116, datetime: '9/29/2024, 9:30:15 PM', type: 'Priority' },
    { number: 117, datetime: '9/29/2024, 9:35:00 PM', type: 'Priority' },
    { number: 118, datetime: '9/29/2024, 9:40:45 PM', type: 'Regular' },
    { number: 119, datetime: '9/29/2024, 9:45:30 PM', type: 'Regular' },
    { number: 120, datetime: '9/29/2024, 9:50:15 PM', type: 'Regular' },
    { number: 121, datetime: '9/29/2024, 9:55:00 PM', type: 'Regular' },
    { number: 122, datetime: '9/29/2024, 10:00:45 PM', type: 'Regular' },
    { number: 123, datetime: '9/29/2024, 10:05:30 PM', type: 'Regular' },
  ];

  currentClientDetails: ClientDetails | null = null;

  // Action Buttons States
  isNextClientActive: boolean = true;
  isClientDoneActive: boolean = false;
  isCallNumberActive: boolean = false;
  isManualSelectActive: boolean = true;
  isReturnTopActive: boolean = false;
  isReturnBottomActive: boolean = false;

  private timerInterval: any;
  private dateInterval: any;

  ngOnInit(): void {
    this.updateCurrentDate();
    this.dateInterval = setInterval(() => this.updateCurrentDate(), 60000);
  }

  ngOnDestroy(): void {
    this.clearIntervals();
  }

  /**
   * Selects a counter and initializes related states.
   * @param counter The counter number selected by the user.
   */
  selectCounter(counter: number): void {
    this.selectedCounter = counter;
  }

  /**
   * Resets the selected counter and stops the timer.
   */
  resetCounter(): void {
    this.selectedCounter = null;
    this.stopTimer();
    this.resetActionButtons();
  }

  /**
   * Moves to the next client in the queue.
   */
  nextClient(): void {
    if (this.tickets.length > 0) {
      const nextTicket = this.tickets.shift();
      if (nextTicket) {
        this.currentNumber = nextTicket.number;
        this.isNextClientActive = false;
        this.isClientDoneActive = true;
        this.isCallNumberActive = true;
        this.isManualSelectActive = false;
        this.isReturnTopActive = true;
        this.isReturnBottomActive = true;

        // Set current client details
        this.currentClientDetails = {
          name: 'Jhielo A. Gonzales',
          date: nextTicket.datetime,
          services: [
            {
              name: 'Request Documents',
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            },
            {
              name: 'File Documents',
              description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            },
            {
              name: 'Make Payment',
              description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            },
          ],
        };

        this.startTimer();
      }
    }
  }

  /**
   * Marks the current client as done and updates states accordingly.
   */
  clientDone(): void {
    this.isClientDoneActive = false;
    this.isNextClientActive = true;
    this.isCallNumberActive = false;
    this.isManualSelectActive = true;
    this.isReturnTopActive = false;
    this.isReturnBottomActive = false;
    this.lastCalledNumber = this.currentNumber.toString();
    this.currentNumber = this.tickets[0]?.number || 0;
    this.currentClientDetails = null;
    this.stopTimer();
  }

  /**
   * Simulates calling the current number.
   */
  callNumber(): void {
    console.log(`Calling number ${this.currentNumber}`);
    this.isCallNumberActive = false;
  }

  /**
   * Toggles the manual select state.
   */
  manualSelect(): void {
    console.log('Manual select clicked');
    this.isManualSelectActive = !this.isManualSelectActive;
  }

  /**
   * Returns the current ticket to the top of the queue.
   */
  returnTop(): void {
    if (this.currentClientDetails) {
      const currentTicket: Ticket = {
        number: this.currentNumber,
        datetime: new Date().toLocaleString(),
        type: 'Regular',
      };
      this.tickets.unshift(currentTicket);
      this.nextClient();
    }
  }

  /**
   * Returns the current ticket to the bottom of the queue.
   */
  returnBottom(): void {
    if (this.currentClientDetails) {
      const currentTicket: Ticket = {
        number: this.currentNumber,
        datetime: new Date().toLocaleString(),
        type: 'Regular',
      };
      this.tickets.push(currentTicket);
      this.nextClient();
    }
  }

  /**
   * Handles the "No Show" action by moving to the next client.
   */
  noShow(): void {
    if (this.tickets.length > 0) {
      this.nextClient();
    }
  }

  /**
   * Starts the timer to track the elapsed time for the current client.
   */
  private startTimer(): void {
    this.timerStartTime = Date.now();
    this.timerInterval = setInterval(() => {
      if (this.timerStartTime) {
        const elapsedTime = Date.now() - this.timerStartTime;
        const hours = Math.floor(elapsedTime / 3600000);
        const minutes = Math.floor((elapsedTime % 3600000) / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        this.timer = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
      }
    }, 1000);
  }

  /**
   * Stops the timer and resets the timer state.
   */
  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timer = '00:00:00';
    this.timerStartTime = null;
  }

  /**
   * Pads a number with a leading zero if it's less than 10.
   * @param num The number to pad.
   * @returns A string representation of the number with at least two digits.
   */
  private padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  /**
   * Updates the current date displayed in the component.
   */
  private updateCurrentDate(): void {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long', // Full month name
      day: 'numeric', // Day as a number
    });
  }

  /**
   * Clears all active intervals to prevent memory leaks.
   */
  private clearIntervals(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.dateInterval) {
      clearInterval(this.dateInterval);
      this.dateInterval = null;
    }
  }

  /**
   * Resets the state of all action buttons to their default values.
   */
  private resetActionButtons(): void {
    this.isNextClientActive = true;
    this.isClientDoneActive = false;
    this.isCallNumberActive = false;
    this.isManualSelectActive = true;
    this.isReturnTopActive = false;
    this.isReturnBottomActive = false;
  }
}
