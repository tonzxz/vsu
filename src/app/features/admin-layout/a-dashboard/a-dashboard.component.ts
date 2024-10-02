import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../../services/user.service';

// Interface to represent recent activity data
interface Activity {
  action: string;
  details: string;
  timestamp: string;
}

// Interface for staff member details and performance
interface StaffMember {
  name: string;
  office: string;
  ticketsServed: number;
  avgServiceTime: string;
  customerRating: number;
  status: string;
  isExpanded: boolean;
  dailyPerformance: {
    date: string;
    clientsServed: number;
  }[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './a-dashboard.component.html',
  styleUrls: ['./a-dashboard.component.css']
})
export class ADashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  constructor(private userService: UserService) {}
  
   // Mock data for overall metrics displayed on the dashboard
  overallMetrics = [
    { title: 'Total Tickets Today', value: 523, icon: 'ticket', trend: [500, 510, 495, 520, 515, 523], change: '+5%' },
    { title: 'Avg. Wait Time', value: '18 min', icon: 'clock', trend: [20, 19, 18, 19, 18, 17], change: '-2 min' },
    { title: 'Active Counters', value: '12/15', icon: 'desktop', trend: [11, 12, 13, 12, 12, 12], change: '+2' },
    { title: 'Active Users', value: 150, icon: '👥', trend: [140, 145, 150, 135, 155, 150], change: '0%' }
  ];

    // Mock data for recent activities displayed on the dashboard
  recentActivities: Activity[] = [
    { action: 'User Added', details: 'New desk attendant for Registrar', timestamp: '2023-08-16 14:30' },
    { action: 'Content Updated', details: 'Service List modified', timestamp: '2023-08-16 13:45' },
    { action: 'Kiosk Maintenance', details: 'K002 serviced', timestamp: '2023-08-16 11:20' }
  ];

    // Mock data for queue analytics by Department
  queueAnalytics = [
    { office: "Registrar's Office", currentTicket: 'A045', waitingCount: 23, avgWaitTime: '25 min', status: 'Busy' },
    { office: "Cash Division", currentTicket: 'B032', waitingCount: 15, avgWaitTime: '15 min', status: 'Moderate' },
    { office: "Accounting Office", currentTicket: 'C028', waitingCount: 18, avgWaitTime: '20 min', status: 'Busy' }
  ];

    // Mock data for staff performance displayed on the dashboard
  staffPerformance: StaffMember[] = [
    { name: "John Doe", office: "Registrar", ticketsServed: 45, avgServiceTime: "10 min", customerRating: 4.8, status: 'Active', isExpanded: false, dailyPerformance: [] },
    { name: "Jane Smith", office: "Cash Division", ticketsServed: 52, avgServiceTime: "8 min", customerRating: 4.9, status: 'Active', isExpanded: false, dailyPerformance: [] },
    { name: "Bob Johnson", office: "Accounting", ticketsServed: 38, avgServiceTime: "12 min", customerRating: 4.7, status: 'On Break', isExpanded: false, dailyPerformance: [] },
    { name: "Alice Brown", office: "Registrar", ticketsServed: 41, avgServiceTime: "11 min", customerRating: 4.6, status: 'Active', isExpanded: false, dailyPerformance: [] },
    { name: "John Doe", office: "Registrar", ticketsServed: 45, avgServiceTime: "10 min", customerRating: 4.8, status: 'Active', isExpanded: false, dailyPerformance: [] },
    { name: "Jane Smith", office: "Cash Division", ticketsServed: 52, avgServiceTime: "8 min", customerRating: 4.9, status: 'Active', isExpanded: false, dailyPerformance: [] },
    { name: "Bob Johnson", office: "Accounting", ticketsServed: 38, avgServiceTime: "12 min", customerRating: 4.7, status: 'On Break', isExpanded: false, dailyPerformance: [] },
    { name: "Alice Brown", office: "Registrar", ticketsServed: 41, avgServiceTime: "11 min", customerRating: 4.6, status: 'Active', isExpanded: false, dailyPerformance: [] },
    { name: "John Doe", office: "Registrar", ticketsServed: 45, avgServiceTime: "10 min", customerRating: 4.8, status: 'Active', isExpanded: false, dailyPerformance: [] },
    { name: "Jane Smith", office: "Cash Division", ticketsServed: 52, avgServiceTime: "8 min", customerRating: 4.9, status: 'Active', isExpanded: false, dailyPerformance: [] },
    { name: "Bob Johnson", office: "Accounting", ticketsServed: 38, avgServiceTime: "12 min", customerRating: 4.7, status: 'On Break', isExpanded: false, dailyPerformance: [] },
    { name: "Alice Brown", office: "Registrar", ticketsServed: 41, avgServiceTime: "11 min", customerRating: 4.6, status: 'Active', isExpanded: false, dailyPerformance: [] }
  ];

   // Mock data for kiosk status
  kioskStatus = [
    { id: "K001", location: "Main Lobby", status: "Operational", ticketsIssued: 250, lastMaintenance: "2023-08-10" },
    { id: "K002", location: "Admin Building", status: "Low Paper", ticketsIssued: 180, lastMaintenance: "2023-08-05" },
    { id: "K003", location: "Student Center", status: "Out of Service", ticketsIssued: 95, lastMaintenance: "2023-08-15" }
  ];

  currentPage = 1;
  itemsPerPage = 10;

  private updateInterval: any;

  // Toggles the expansion of staff details and populates daily performance data
  toggleStaffDetails(staff: StaffMember) {
    staff.isExpanded = !staff.isExpanded;
    if (staff.isExpanded && staff.dailyPerformance.length === 0) {
      staff.dailyPerformance = this.generateDailyPerformance();
    }
  }

 // Generates random daily performance data for staff members
  private generateDailyPerformance() {
    const performance = [];
    for (let i = 1; i <= 7; i++) {
      performance.push({
        date: `Jul ${i}`,
        clientsServed: this.getRandomInt(20, 60)
      });
    }
    return performance;
  }

 // Lifecycle hook to initialize component, fetch current user, and set data update interval
  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    console.log('Current User Role:', this.currentUser?.role);
    console.log('Current User Department:', this.currentUser?.department); 
    this.updateInterval = setInterval(() => {
      this.updateOverallMetrics();
      this.updateQueueAnalytics();
    }, 5000); 
  }

  // Lifecycle hook to clean up when component is destroyed (clear the interval)
  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  get paginatedStaffPerformance() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.staffPerformance.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.staffPerformance.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Updates overall metrics like tickets, wait time, counters, and users with random data
  updateOverallMetrics() {
    this.overallMetrics.forEach(metric => {
      if (metric.title === 'Total Tickets Today') {
        const newValue = this.getRandomInt(500, 600);
        metric.trend.push(newValue);
        if (metric.trend.length > 7) metric.trend.shift();
        metric.value = newValue;
        metric.change = this.calculateChange(metric.trend);
      } else if (metric.title === 'Avg. Wait Time') {
        const newValue = this.getRandomInt(10, 25);
        metric.trend.push(newValue);
        if (metric.trend.length > 7) metric.trend.shift();
        metric.value = `${newValue} min`;
        metric.change = this.calculateChange(metric.trend) + ' min';
      } else if (metric.title === 'Active Counters') {
        const newValue = this.getRandomInt(10, 15);
        metric.trend.push(newValue);
        if (metric.trend.length > 7) metric.trend.shift();
        metric.value = `${newValue}/15`;
        metric.change = this.calculateChange(metric.trend);
      } else if (metric.title === 'Active Users') {
        const newValue = this.getRandomInt(100, 200);
        metric.trend.push(newValue);
        if (metric.trend.length > 7) metric.trend.shift();
        metric.value = newValue;
        metric.change = this.calculateChange(metric.trend) + '%';
      }
    });
  }

 // Updates queue analytics with random ticket and wait time data
  updateQueueAnalytics() {
    this.queueAnalytics.forEach(queue => {
      queue.currentTicket = this.generateTicketNumber(queue.office[0]);
      queue.waitingCount = this.getRandomInt(5, 30);
      queue.avgWaitTime = `${this.getRandomInt(10, 30)} min`;
      queue.status = this.determineQueueStatus(queue.waitingCount);
    });
  }

 // Generate random ticket number with a given prefix (A, B, C, etc.)
  generateTicketNumber(prefix: string): string {
    const number = this.getRandomInt(1, 99).toString().padStart(3, '0');
    return `${prefix}${number}`;
  }
  
// Determines queue status based on the waiting count
  determineQueueStatus(waitingCount: number): string {
    if (waitingCount < 10) return 'Normal';
    if (waitingCount < 20) return 'Moderate';
    return 'Busy';
  }

  getTrendPoints(trend: number[]): string {
    if (trend.length === 0) return '0,100 100,100'; // Default to a flat line if no data

    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min || 1; // Avoid division by zero
    const points = trend.map((value, index) => {
      const x = (index / (trend.length - 1)) * 100; // Spread points evenly across width
      const y = 100 - ((value - min) / range) * 100; // Scale values to fit within height
      return `${x},${y}`;
    });

    return points.join(' ');
  }

  // Generate a random integer between min and max (inclusive)
  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Calculate the percentage change in a trend array
  calculateChange(trend: number[]): string {
    if (trend.length < 2) return '0%';
    const change = trend[trend.length - 1] - trend[trend.length - 2];
    const percentChange = (change / trend[trend.length - 2]) * 100;
    return (percentChange >= 0 ? '+' : '') + percentChange.toFixed(1) + '%';
  }
}