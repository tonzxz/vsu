import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { LottieAnimationComponent } from '../../../shared/components/lottie-animation/lottie-animation.component';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';
import { TerminalService } from '../../../services/terminal.service';
import { ContentService } from '../../../services/content.service';
import { DivisionService } from '../../../services/division.service';
import { ConfirmationComponent } from '../../../shared/modals/confirmation/confirmation.component';
import { Subscription } from 'rxjs';
import { QueueService } from '../../../services/queue.service';


interface Terminal{
  id:string;
  division_id:string;
  number:string;
  status:string;  
  last_active?:string;
  attendant?:string;
}

interface Division{
  id:string;
  name:string;
}


interface Ticket {
  id?:string;
  division_id?:string;
  number: number;
  status?:string;
  timestamp?:string;
  type: 'priority' | 'regular';
  fullname?:string;
  department_id?:string;
  kiosk_id?:string;
  gender?:string;
  student_id?:string;
  // timestamp: string;
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
    MatTabsModule,
    LottieAnimationComponent,
    ConfirmationComponent,
  ]
})
export class DaTerminalmgmtComponent implements OnInit, OnDestroy {
  selectedCounter?: Terminal;
  counters: number[] = [1, 2, 3, 4, 5];
  currentTicket?: Ticket;
  lastCalledNumber: string = 'N/A';
  currentDate: string = '';
  timer: string = '00:00:00';
  timerStartTime: number | null = null;

  division?:Division;

  terminateModal:boolean = false;

  tickets: Ticket[] = [
    { number: 112, timestamp: '9/29/2024, 9:13:24 PM', type: 'priority' },
    { number: 113, timestamp: '9/29/2024, 9:15:10 PM', type: 'priority' },
    { number: 114, timestamp: '9/29/2024, 9:20:45 PM', type: 'regular' },
    { number: 115, timestamp: '9/29/2024, 9:25:30 PM', type: 'regular' },
    { number: 116, timestamp: '9/29/2024, 9:30:15 PM', type: 'priority' },
    { number: 117, timestamp: '9/29/2024, 9:35:00 PM', type: 'priority' },
    { number: 118, timestamp: '9/29/2024, 9:40:45 PM', type: 'regular' },
    { number: 119, timestamp: '9/29/2024, 9:45:30 PM', type: 'regular' },
    { number: 120, timestamp: '9/29/2024, 9:50:15 PM', type: 'regular' },
    { number: 121, timestamp: '9/29/2024, 9:55:00 PM', type: 'regular' },
    { number: 122, timestamp: '9/29/2024, 10:00:45 PM', type: 'regular' },
    { number: 123, timestamp: '9/29/2024, 10:05:30 PM', type: 'regular' },
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
  private statusInterval:any;
  private subscription?:Subscription;

  lastSession?:any;

  actionLoading:boolean = false;
  terminals: Terminal[]=[];
  statusMap:any = {
    'available' : 'bg-orange-500',
    'maintenance' : 'bg-red-500',
    'online' : 'bg-green-500',
  }


  constructor( 
    private dvisionService:DivisionService,
    private API:UswagonCoreService,
    private queueService:QueueService,
    private terminalService:TerminalService) {}

  ngOnInit(): void {
    this.updateCurrentDate();
    this.dateInterval = setInterval(() => this.updateCurrentDate(), 60000);
    this.loadContent();
  }

  ngOnDestroy(): void {
    this.clearIntervals();
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  async loadContent(){
    this.API.setLoading(true);
    this.division = await this.dvisionService.getDivision() ;
    this.terminals = await this.terminalService.getAllTerminals();
    
    this.lastSession = await this.terminalService.getActiveSession()
    if(this.lastSession){
      this.selectedCounter = this.terminals.find(terminal=>terminal.id == this.lastSession.terminal_id);
      this.terminalService.refreshTerminalStatus(this.lastSession.id);
      this.API.sendFeedback('warning','You have an ongoing session.',5000);
    }
    this.subscription = this.queueService.queue$.subscribe((queueItems: Ticket[]) => {
      this.tickets = [...queueItems];
    });

    this.queueService.listenToQueue();

    await this.queueService.getTodayQueues();
    const {attendedQueue,queue} =await this.queueService.getQueueOnDesk();
    
    this.currentTicket = queue ? {...queue!} : undefined;
   
    const lastQueue = await this.queueService.getLastQueueOnDesk();

    if(lastQueue)[
      this.lastCalledNumber = (lastQueue.type=='priority' ? 'P' : 'R') +'-' + lastQueue.number.toString().padStart(3, '0')
    ]

    if(this.currentTicket){
      this.startTimer();
      this.isNextClientActive = false;
      this.isClientDoneActive = true;
      this.isCallNumberActive = true;
      this.isManualSelectActive = false;
      this.isReturnTopActive = true;
      this.isReturnBottomActive = true;
      
      this.timerStartTime = new Date(attendedQueue?.attended_on!).getTime();

      this.API.sendFeedback('warning','You have an active transaction.',5000);
    }

    this.API.setLoading(false);  
    this.statusInterval = setInterval(async ()=>{
      const exisitingTerminals:string[] = [];
      const updatedTerminals = await this.terminalService.getAllTerminals();
      // Update existing terminals
      updatedTerminals.forEach((updatedTerminal:any) => {
        exisitingTerminals.push(updatedTerminal.id);
        const existingTerminal = this.terminals.find(t => t.id === updatedTerminal.id);
        if (existingTerminal) {
          Object.assign(existingTerminal, updatedTerminal);
        } else {
          this.terminals.push(updatedTerminal);
        }
      });
      // get last session
      this.terminals = this.terminals.filter(terminal=> exisitingTerminals.includes(terminal.id))
      if(this.lastSession){
        const terminal =  this.terminals.find(terminal=>terminal.id == this.lastSession.terminal_id);
        if(terminal?.status == 'maintenance'){
          this.terminalService.terminateTerminalSession();
          this.selectedCounter = undefined;
          this.lastSession = undefined;
          this.API.sendFeedback('error','Your terminal is for maintenance. You have been logout!',5000)
        }
      }
    },1000)   

      
   

     
  }


  openTerminateModal(){
    this.terminateModal = true;
  }

  closeTerminateModal(){
    this.terminateModal = false;
  }

  /**
   * Selects a counter and initializes related states.
   * @param counter The counter number selected by the user.
   */
  async selectCounter(counter: Terminal) {
    if(counter.status == 'maintenance'){
      this.API.sendFeedback('warning', 'This terminal is under maintenance', 5000);
      return; 
    }
    if(counter.status == 'online'){
      this.API.sendFeedback('warning', 'This terminal is used by another attendant', 5000);
      return; 
    }
    this.selectedCounter = counter;
    this.API.setLoading(true);
    await this.terminalService.startTerminalSession(counter.id);
    this.lastSession = await this.terminalService.getActiveSession()
    this.terminalService.refreshTerminalStatus(this.lastSession.id);
    this.API.setLoading(false);
    const index = this.terminals.findIndex(terminal=>terminal.id == counter.id);
    this.API.sendFeedback('success',`You are now logged in to Terminal ${index + 1}`,5000);
  }


  /**
   * Resets the selected counter and stops the timer.
   */
  async resetCounter() {
    this.closeTerminateModal();
    this.API.setLoading(true);
    this.selectedCounter = undefined;
    this.currentTicket = undefined;
    await this.terminalService.terminateTerminalSession();
    this.stopTimer();
    this.resetActionButtons();
    this.API.setLoading(false);
    this.API.sendFeedback('warning','You have logged out from your terminal.',5000);
  }

  /**
   * Moves to the next client in the queue.
   */
  async nextClient() {
    if( this.actionLoading ) return;
    if (this.tickets.length > 0) {
        this.actionLoading = true;
      // if (nextTicket) {
        this.currentTicket =  await  this.queueService.nextQueue();;
        this.isNextClientActive = false;
        this.isClientDoneActive = true;
        this.isCallNumberActive = true;
        this.isManualSelectActive = false;
        this.isReturnTopActive = true;
        this.isReturnBottomActive = true;
        
       

        // Set current client details
        this.currentClientDetails = {
          name: 'Jhielo A. Gonzales',
          date: this.currentTicket?.timestamp!,
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
      // }
      this.actionLoading = false;
      this.API.sendFeedback('success', `Transaction started with client.`,5000);
    }
    
  }


  resetInterface(){
    this.isClientDoneActive = false;
    this.isNextClientActive = true;
    this.isCallNumberActive = false;
    this.isManualSelectActive = true;
    this.isReturnTopActive = false;
    this.isReturnBottomActive = false;
    this.lastCalledNumber = (this.currentTicket?.type == 'priority' ? 'P' :'R') +'-' + this.currentTicket!.number.toString().padStart(3, '0');
    this.currentTicket= undefined;
    this.currentClientDetails = null;
    this.stopTimer();
  }

  /**
   * Marks the current client as done and updates states accordingly.
   */
  async clientDone() {
    if(this.actionLoading) return;
    this.actionLoading = true;
    await this.queueService.resolveAttendedQueue('finished');
    this.resetInterface();
    
    this.actionLoading = false;
    this.API.sendFeedback('success', `Transaction successful!`,5000);
  }

  /**
   * Simulates calling the current number.
   */
  callNumber(): void {
    console.log(`Calling number ${this.currentTicket?.number}`);
    this.API.sendFeedback('neutral', `Calling number ${this.currentTicket?.type =='priority' ? 'P':'R'}-${this.currentTicket?.number.toString().padStart(3, '0')}`)
    // this.isCallNumberActive = false;
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
    
  }

  /**
   * Returns the current ticket to the bottom of the queue.
   */
  async returnBottom() {
    if(this.actionLoading) return;
    this.actionLoading = true;
    await this.queueService.resolveAttendedQueue('bottom');
    this.resetInterface();
    this.stopTimer();
    this.actionLoading = false;
    this.API.sendFeedback('warning', `Client has been put to bottom of queue.`,5000);
  }

  /**
   * Handles the "No Show" action by moving to the next client.
   */
  async noShow() {
    if(this.actionLoading) return;
    this.actionLoading =true;
    await this.queueService.resolveAttendedQueue('skipped');
    this.currentClientDetails = null;
    this.resetInterface();
    this.actionLoading = false;
    this.API.sendFeedback('error', `Client has been removed from queue.`,5000);
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
    if(this.statusInterval){
      clearInterval(this.statusInterval);
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
