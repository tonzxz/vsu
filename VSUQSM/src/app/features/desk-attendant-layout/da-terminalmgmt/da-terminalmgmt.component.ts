import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatButtonToggleModule,
    MatSnackBarModule,
  ],
})
export class DaTerminalmgmtComponent implements OnInit, OnDestroy {
  selectedCounter: number = 1;
  counters: number[] = [1, 2, 3, 4];
  currentNumber: number = 110;
  lastCalledNumber: string = 'N/A';
  currentDate: string = '';
  timer: string = '00:00:00';

  tickets: Ticket[] = [
    { number: 112, datetime: 'August 20, 2023 - 8:21 AM', type: 'Priority' },
    { number: 113, datetime: 'August 20, 2023 - 8:21 AM', type: 'Priority' },
    { number: 114, datetime: 'August 20, 2023 - 8:21 AM', type: 'Regular' },
    { number: 115, datetime: 'August 20, 2023 - 8:21 AM', type: 'Regular' },
    { number: 116, datetime: 'August 20, 2023 - 8:21 AM', type: 'Priority' },
    { number: 117, datetime: 'August 20, 2023 - 8:21 AM', type: 'Priority' },
    { number: 118, datetime: 'August 20, 2023 - 8:21 AM', type: 'Regular' },
    { number: 119, datetime: 'August 20, 2023 - 8:21 AM', type: 'Regular' },
    { number: 120, datetime: 'August 20, 2023 - 8:21 AM', type: 'Regular' },
    { number: 121, datetime: 'August 20, 2023 - 8:21 AM', type: 'Regular' },
    { number: 122, datetime: 'August 20, 2023 - 8:21 AM', type: 'Regular' },
    { number: 123, datetime: 'August 20, 2023 - 8:21 AM', type: 'Regular' },
  ];

  currentClientDetails: ClientDetails = {
    name: 'Jhielo A. Gonzales',
    date: 'August 20, 2023 - 8:21 AM',
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

  showClientDetails: boolean = false;
  isNextClientActive: boolean = true;
  isClientDoneActive: boolean = false;
  isCallNumberActive: boolean = false;
  isManualSelectActive: boolean = true;
  isReturnTopActive: boolean = false;
  isReturnBottomActive: boolean = false;

  private timerInterval: any;
  private dateInterval: any;

  ngOnInit(): void {
    this.startTimer();
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

  toggleView(showDetails: boolean): void {
    this.showClientDetails = showDetails;
  }

  nextClient(): void {
    if (this.tickets.length > 0) {
      const nextTicket = this.tickets.shift();
      if (nextTicket) {
        this.currentNumber = nextTicket.number;
        this.isNextClientActive = false;
        this.isClientDoneActive = true;
        this.isCallNumberActive = true;
      }
    }
  }

  clientDone(): void {
    this.isClientDoneActive = false;
    this.isNextClientActive = true;
    this.isCallNumberActive = false;
    this.lastCalledNumber = this.currentNumber.toString();
    this.currentNumber = this.tickets[0]?.number || 0;
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
    if (this.tickets.length > 0) {
      const topTicket = this.tickets[0];
      this.tickets.unshift({
        number: this.currentNumber,
        datetime: new Date().toLocaleString(),
        type: 'Regular',
      });
      this.currentNumber = topTicket.number;
      this.isReturnTopActive = false;
    }
  }

  returnBottom(): void {
    if (this.tickets.length > 0) {
      this.tickets.push({
        number: this.currentNumber,
        datetime: new Date().toLocaleString(),
        type: 'Regular',
      });
      this.currentNumber = this.tickets[0].number;
      this.isReturnBottomActive = false;
    }
  }

  noShow(): void {
    if (this.tickets.length > 0) {
      this.tickets.shift();
      this.currentNumber = this.tickets[0]?.number || 0;
    }
  }

  exit(): void {
    console.log('Exit clicked');
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      const now = new Date();
      this.timer = now.toTimeString().split(' ')[0];
    }, 1000);
  }

  private updateCurrentDate(): void {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}