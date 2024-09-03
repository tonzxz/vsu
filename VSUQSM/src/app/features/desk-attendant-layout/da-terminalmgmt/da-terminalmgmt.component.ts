import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
})
export class DaTerminalmgmtComponent implements OnInit {
  counter1: number = 110;
  counter2: string = 'N/A';
  currentDate: string = 'Aug 20, 2024 - 7:32 AM';
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
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in.',
      },
      {
        name: 'File Documents',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in.',
      },
      {
        name: 'Make Payment',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in.',
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

  constructor() {}

  ngOnInit(): void {
    this.startTimer();
    this.updateCurrentDate();
  }

  toggleView(showDetails: boolean): void {
    this.showClientDetails = showDetails;
  }

  nextClient(): void {
    if (this.tickets.length > 0) {
      const nextTicket = this.tickets.shift();
      if (nextTicket) {
        this.counter1 = nextTicket.number;
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
    this.counter2 = this.counter1.toString();
    this.counter1 = this.tickets[0]?.number || 0;
  }

  callNumber(): void {
    // Implement call number logic (e.g., show a notification or play a sound)
    console.log(`Calling number ${this.counter1}`);
    this.isCallNumberActive = false;
  }

  manualSelect(): void {
    // Implement manual select logic (e.g., open a dialog to select a ticket)
    console.log('Manual select clicked');
    this.isManualSelectActive = !this.isManualSelectActive;
  }

  returnTop(): void {
    if (this.tickets.length > 0) {
      const topTicket = this.tickets[0];
      this.tickets.unshift({
        number: this.counter1,
        datetime: new Date().toLocaleString(),
        type: 'Regular',
      });
      this.counter1 = topTicket.number;
      this.isReturnTopActive = false;
    }
  }

  returnBottom(): void {
    if (this.tickets.length > 0) {
      this.tickets.push({
        number: this.counter1,
        datetime: new Date().toLocaleString(),
        type: 'Regular',
      });
      this.counter1 = this.tickets[0].number;
      this.isReturnBottomActive = false;
    }
  }

  noShow(): void {
    if (this.tickets.length > 0) {
      this.tickets.shift(); // Remove the current ticket
      this.counter1 = this.tickets[0]?.number || 0;
    }
  }

  exit(): void {
    // Implement exit logic (e.g., navigate to a different page or show a confirmation dialog)
    console.log('Exit clicked');
  }

  private startTimer(): void {
    setInterval(() => {
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
