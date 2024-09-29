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
    { number: 113, datetime: '9/29/2024, 9:13:24 PM', type: 'Priority' },
    { number: 114, datetime: '9/29/2024, 9:13:24 PM', type: 'Regular' },
    { number: 115, datetime: '9/29/2024, 9:13:24 PM', type: 'Regular' },
    { number: 116, datetime: '9/29/2024, 9:13:24 PM', type: 'Priority' },
    { number: 117, datetime: '9/29/2024, 9:13:24 PM', type: 'Priority' },
    { number: 118, datetime: '9/29/2024, 9:13:24 PM', type: 'Regular' },
    { number: 119, datetime: '9/29/2024, 9:13:24 PM', type: 'Regular' },
    { number: 120, datetime: '9/29/2024, 9:13:24 PM', type: 'Regular' },
    { number: 121, datetime: '9/29/2024, 9:13:24 PM', type: 'Regular' },
    { number: 122, datetime: '9/29/2024, 9:13:24 PM', type: 'Regular' },
    { number: 123, datetime: '9/29/2024, 9:13:24 PM', type: 'Regular' },
  ];

  currentClientDetails: ClientDetails | null = null;

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
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.dateInterval) {
      clearInterval(this.dateInterval);
    }
  }

  selectCounter(counter: number): void {
    this.selectedCounter = counter;
  }

  resetCounter(): void {
    this.selectedCounter = null;
    this.stopTimer();
  }

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

  callNumber(): void {
    console.log(`Calling number ${this.currentNumber}`);
    this.isCallNumberActive = false;
  }

  manualSelect(): void {
    console.log('Manual select clicked');
    this.isManualSelectActive = !this.isManualSelectActive;
  }

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

  noShow(): void {
    if (this.tickets.length > 0) {
      this.nextClient();
    }
  }

  private startTimer(): void {
    this.timerStartTime = Date.now();
    this.timerInterval = setInterval(() => {
      const elapsedTime = Date.now() - this.timerStartTime!;
      const hours = Math.floor(elapsedTime / 3600000);
      const minutes = Math.floor((elapsedTime % 3600000) / 60000);
      const seconds = Math.floor((elapsedTime % 60000) / 1000);
      this.timer = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timer = '00:00:00';
      this.timerStartTime = null;
    }
  }

  private padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  private updateCurrentDate(): void {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long', // Full month name
      day: 'numeric', // Day as a number
    });
  }
  
  };
  

