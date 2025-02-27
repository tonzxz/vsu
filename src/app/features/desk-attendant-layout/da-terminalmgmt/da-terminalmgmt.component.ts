


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
  get status():string;  
  _status:string;  
  last_active?:string;
  attendant?:string;
}

interface Division{
  id:string;
  name:string;
}


interface Ticket {
  id:string;
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
  department?: string;
  student_id?: string;
  gender?:string;
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
  selectedTicket?: Ticket; //selection manually
  division?:Division;

  terminateModal:boolean = false;

  tickets: Ticket[] = [
    
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
    'available' : 'bg-green-500',
    'maintenance' : 'bg-red-500',
    'online' : 'bg-orange-500',
  }
timerProgress: any;



  constructor( 
    private dvisionService:DivisionService,
    private API:UswagonCoreService,
    private queueService:QueueService,
    private terminalService:TerminalService) {}

  ngOnInit(): void {
    this.updateCurrentDate();
    this.dateInterval = setInterval(() => this.updateCurrentDate(), 60000);
    this.loadContent();

    this.subscription = this.queueService.queue$.subscribe((queueItems: Ticket[]) => {
      this.tickets = [...queueItems];
      // Clear selection if selected ticket no longer exists in queue
      if (this.selectedTicket && !queueItems.find(t => t.id === this.selectedTicket!.id)) {
        this.selectedTicket = undefined;
      }
    });
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
    }
    this.subscription = this.queueService.queue$.subscribe((queueItems: Ticket[]) => {
      this.tickets = [...queueItems];
    });

    this.queueService.listenToQueue();

    await this.queueService.getTodayQueues();

    await this.updateTerminalData();
    this.API.addSocketListener('terminal-events', async(data)=>{
      if(data.event =='terminal-events'){
        await this.updateTerminalData();
      }
    })

    this.API.setLoading(false);  
  }

  async updateTerminalData(){
    const exisitingTerminals:string[] = [];
    const updatedTerminals = await this.terminalService.getAllTerminals();

    // Update existing terminals
    updatedTerminals.forEach((updatedTerminal:Terminal) => {
      exisitingTerminals.push(updatedTerminal.id);

      const existingTerminal = this.terminals.find(t => t.id === updatedTerminal.id);
      if (existingTerminal) {
        Object.keys(updatedTerminal).forEach((key) => {
          // Check if the property is a regular property (not a getter)
          const descriptor = Object.getOwnPropertyDescriptor(updatedTerminal, key);
          if (descriptor && !descriptor.get) {
            existingTerminal[key as keyof Omit<Terminal, 'status'>] = updatedTerminal[key as keyof Omit<Terminal, 'status'>]!;
          }
        });
      } else {
        this.terminals.push(updatedTerminal);
      }

    });
    this.terminals = this.terminals.filter(terminal=> exisitingTerminals.includes(terminal.id))

    // get last session
    this.terminals = [...updatedTerminals]
    if(this.lastSession){
      const terminal =  this.terminals.find(terminal=>terminal.id == this.lastSession.terminal_id);
      if(terminal?.status == 'maintenance'){
        this.terminalService.terminateTerminalSession();
        this.selectedCounter = undefined;
        this.lastSession = undefined;
        this.selectedTicket = undefined;
        this.currentTicket = undefined;
        this.API.sendFeedback('error','Your terminal is for maintenance. You have been logout!',5000)
      }
    }
  }
  private updateUpcomingTicket() {
    // Find the next 'waiting' ticket in the queue
    const nextTicket = this.tickets.find(ticket => ticket.status === 'waiting');
  
    // Update the lastCalledNumber with the next ticket's number or 'N/A' if not available
    this.lastCalledNumber = nextTicket
      ? `${nextTicket.type === 'priority' ? 'P-' : 'R-'}${nextTicket.number.toString().padStart(3, '0')}`
      : 'N/A';
  }  

  openTerminateModal(){
    this.terminateModal = true;
  }

  closeTerminateModal(){
    this.terminateModal = false;
  }
  //slection of row manually
  selectTicket(ticket: Ticket) {
    if (this.isManualSelectActive) {
      if (this.selectedTicket?.id === ticket.id) {
        this.selectedTicket = undefined;
      } else {
        this.selectedTicket = ticket;
      }
    }
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
    this.API.socketSend({event:'terminal-events'})
    this.API.socketSend({event:'queue-events'})
    this.API.socketSend({event:'admin-dashboard-events'})
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
    this.API.socketSend({event:'terminal-events'})
    this.API.socketSend({event:'queue-events'})
    this.API.socketSend({event:'admin-dashboard-events'})
    this.resetActionButtons();
    this.API.setLoading(false);
    this.API.sendFeedback('warning','You have logged out from your terminal.',5000);
  }

  async priorityClient() {
    if (this.actionLoading) return;

    try {
      
      this.actionLoading = true;
      
      // If there's a current transaction, finish it first
      if (this.currentTicket) {
        await this.queueService.resolveAttendedQueue('finished');
        this.resetInterface();
        this.API.socketSend({event:'queue-events'})
        this.API.socketSend({event:'admin-dashboard-events'})
        this.API.sendFeedback('success','Transaction successful!');
        
        return;
      }

      const priorityTickets = this.tickets.filter(
        ticket => ticket.type === 'priority' && 
        (ticket.status === 'waiting' || ticket.status === 'bottom')
      );
 

      if (priorityTickets.length === 0) {
        this.API.sendFeedback('warning', 'No priority clients in queue.', 5000);
        this.actionLoading = false;
        return;
      }


      // Use the type-based nextQueue method
      const nextTicket = await this.queueService.nextQueue('priority');
      this.API.socketSend({event:'queue-events'})
      this.API.socketSend({event:'admin-dashboard-events'})
      if (nextTicket) {
        this.currentTicket = nextTicket;
        this.currentClientDetails = {
          name: nextTicket.fullname || 'N/A',
          date: nextTicket.timestamp || this.currentDate,
          services: [
            {
              name: 'Request Documents',
              description: '',
            },
          ],
          student_id: nextTicket.student_id || 'N/A',
          department: nextTicket.department_id || 'N/A',
        };

        // Update states
        this.isNextClientActive = false;
        this.isClientDoneActive = true;
        this.isCallNumberActive = true;
        this.isManualSelectActive = true;
        this.isReturnTopActive = true;
        this.isReturnBottomActive = true;

        // Start timer and update display
        this.startTimer();
        this.updateUpcomingTicket();
        
        this.API.sendFeedback('success', `Priority transaction started with client.`, 5000);
      }
    } catch (error) {
      console.error('Priority client error:', error);
      this.API.sendFeedback('error', 'Failed to process priority client. Please try again.', 5000);
    } finally {
      this.actionLoading = false;
    }
}



  async nextClient() {
    if (this.actionLoading) return;

    try {
      this.actionLoading = true;

      // If there's a current transaction, finish it first
      if (this.currentTicket) {
        await this.queueService.resolveAttendedQueue('finished');
        this.resetInterface();
        this.API.sendFeedback('success','Transaction successful!');
        this.actionLoading = false;
        return;
      }

      if (this.tickets.length === 0) {
        this.API.sendFeedback('warning', 'No clients in queue.', 5000);
        this.actionLoading = false;
        return;
      }


      // Use the selected ticket type if available
      let nextTicket: Ticket | undefined;
      if (this.selectedTicket && this.isManualSelectActive) {
        // Use the existing queue type-based method
        nextTicket = await this.queueService.nextQueue(this.selectedTicket.type);
      } else {
        // Get next ticket without type specification
        nextTicket = await this.queueService.nextQueue();
      }

      if (nextTicket) {
        this.currentTicket = nextTicket;
        this.currentClientDetails = {
          name: nextTicket.fullname || 'N/A',
          date: nextTicket.timestamp || this.currentDate,
          services: [
            {
              name: 'Request Documents',
              description: '',
            },
          ],
          student_id: nextTicket.student_id || 'N/A',
          department: nextTicket.department_id || 'N/A',
        };

        // Update states
        this.isNextClientActive = false;
        this.isClientDoneActive = true;
        this.isCallNumberActive = true;
        this.isManualSelectActive = true;
        this.isReturnTopActive = true;
        this.isReturnBottomActive = true;

        // Clear selection
        this.selectedTicket = undefined;

        // Start timer and update display
        this.startTimer();
        this.updateUpcomingTicket();
        
        this.API.sendFeedback('success', `Transaction started with client.`, 5000);
      } else {
        this.API.sendFeedback('warning', 'Could not get next client.', 5000);
      }

    } catch (error) {
      console.error('Next client error:', error);
      this.API.sendFeedback('error', 'Failed to process client. Please try again.', 5000);
    } finally {
      this.actionLoading = false;
    }
}


  // Modified resetInterface method
  resetInterface() {
    this.isClientDoneActive = false;
    this.isNextClientActive = true;
    this.isCallNumberActive = false;
    this.isManualSelectActive = true;  // Keep manual selection mode active
    this.isReturnTopActive = false;
    this.isReturnBottomActive = false;
    if (this.currentTicket) {
      this.lastCalledNumber = (this.currentTicket.type == 'priority' ? 'P' : 'R') + '-' + 
        this.currentTicket.number.toString().padStart(3, '0');
    }
    this.currentTicket = undefined;
    this.currentClientDetails = null;
    // Don't clear selectedTicket here to maintain selection
    this.stopTimer();
  }


  /**
   * Marks the current client as done and updates states accordingly.
   */
  
  async clientDone() {
    if (this.actionLoading) return;
    this.actionLoading = true;

    try {
      await this.queueService.resolveAttendedQueue('finished');
      
      // If we have a next selection and manual mode is active, process it
      if (this.selectedTicket && this.isManualSelectActive) {
        await this.nextClient();
      } else {
        this.resetInterface();
      }
      
      this.API.sendFeedback('success', `Transaction successful!`, 5000);
    } catch (error) {
      this.API.sendFeedback('error', 'Failed to complete transaction', 5000);
    } finally {
      this.actionLoading = false;
    }
  }



  /**
   * Simulates calling the current number.
   */
  callNumber(): void {
    console.log(`Calling number ${this.currentTicket?.number}`);
    this.API.sendFeedback('neutral', `Calling number ${this.currentTicket?.type =='priority' ? 'P':'R'}-${this.currentTicket?.number.toString().padStart(3, '0')}`,5000)
    
    this.API.socketSend({
      event: 'number-calling',
      division: this.division?.id,
      message: `Calling ${this.currentTicket?.type =='priority' ? 'Priority':''} number ${this.currentTicket?.number} at counter ${this.selectedCounter?.number}`
    })
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
   * Returns the current ticket to the bottom of the queue.
   */
  async returnBottom() {
    if(this.actionLoading) return;
    this.actionLoading = true;
    await this.queueService.resolveAttendedQueue('bottom');
    this.resetInterface();
    this.stopTimer();
    this.actionLoading = false;
    this.API.socketSend({event:'queue-events'})
    this.API.socketSend({event:'admin-dashboard-events'})
    this.API.sendFeedback('warning', `Client has been put to bottom of queue.`,5000);
  }

  /**
   * Handles the "No Show" action by moving to the next client.
   */
  async noShow() {
    if (this.actionLoading) return;
    this.actionLoading = true;
  
    // Mark the current ticket as skipped
    await this.queueService.resolveAttendedQueue('skipped');
  
    // Reset the current client details
    this.currentClientDetails = null;
    this.resetInterface();
  
    // Update the upcoming ticket
    this.updateUpcomingTicket();
  
    this.actionLoading = false;
    this.API.socketSend({event:'queue-events'})
    this.API.socketSend({event:'admin-dashboard-events'})
    this.API.sendFeedback('error', `Client has been removed from queue.`, 5000);
  }
  

  /**
   * Starts the timer to track the elapsed time for the current client.
   */
  calculateTimerProgress(): number {
    if (!this.timerStartTime) return 0;
    const elapsedTime = Date.now() - this.timerStartTime;
    const maxTime = 15 * 60 * 1000; // 15 minutes in milliseconds
    return Math.max(0, 100 - (elapsedTime / maxTime * 100));
  }

  // Update startTimer method to include progress calculation
  private startTimer(): void {
    this.timerStartTime = Date.now();
    this.timerInterval = setInterval(() => {
      if (this.timerStartTime) {
        const elapsedTime = Date.now() - this.timerStartTime;
        const hours = Math.floor(elapsedTime / 3600000);
        const minutes = Math.floor((elapsedTime % 3600000) / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        this.timer = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
        this.timerProgress = this.calculateTimerProgress();
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