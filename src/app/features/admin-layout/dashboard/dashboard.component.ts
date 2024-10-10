import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../../services/user.service';
import Chart from 'chart.js/auto';

interface QueueAnalytics {
  office: string;
  currentTicket: number;
  waitingCount: number;
  avgWaitTime: string;
  status: string;
}


// Interface for staff member details and performance
interface StaffPerformance {
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
interface KioskStatus {
  id: string;
  location: string;
  status: string;
  ticketsIssued: number;
  lastMaintenance: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  currentUser: User | null = null;

  @ViewChildren('dailyPerformanceCanvas') dailyPerformanceCanvases!: QueryList<ElementRef>;


  // Mock data for Queue Analytics, Staff Performance, and Kiosk Status
  queueAnalytics: QueueAnalytics[] = [
    { office: 'Main Office', currentTicket: 123, waitingCount: 20, avgWaitTime: '15 min', status: 'Busy' },
    { office: 'Branch A', currentTicket: 89, waitingCount: 5, avgWaitTime: '10 min', status: 'Moderate' },
    { office: 'Branch B', currentTicket: 45, waitingCount: 2, avgWaitTime: '8 min', status: 'Normal' }
  ];

  paginatedStaffPerformance: StaffPerformance[] = [
    { name: "John Doe", office: "Registrar", ticketsServed: 45, avgServiceTime: "10 min", customerRating: 4.8, status: 'Active', isExpanded: false, dailyPerformance: [] },
    { name: "Jane Smith", office: "Cash Division", ticketsServed: 52, avgServiceTime: "8 min", customerRating: 4.9, status: 'Active', isExpanded: false, dailyPerformance: [] },
    { name: "Bob Johnson", office: "Accounting", ticketsServed: 38, avgServiceTime: "12 min", customerRating: 4.7, status: 'On Break', isExpanded: false, dailyPerformance: [] },
    { name: "Alice Brown", office: "Registrar", ticketsServed: 41, avgServiceTime: "11 min", customerRating: 4.6, status: 'Active', isExpanded: false, dailyPerformance: [] },
  ];

  kioskStatus: KioskStatus[] = [
    { id: 'K01', location: 'Main Hall', status: 'Operational', ticketsIssued: 500, lastMaintenance: '2023-09-20' },
    { id: 'K02', location: 'Branch A', status: 'Low Paper', ticketsIssued: 300, lastMaintenance: '2023-09-25' },
    { id: 'K03', location: 'Branch B', status: 'Out of Service', ticketsIssued: 0, lastMaintenance: '2023-09-10' }
  ];

  overallMetrics = [
    { title: 'Total Tickets Today', value: 523, icon: 'ticket', data: [520, 525, 530, 528, 531, 529], label: 'Tickets' },
    { title: 'Avg. Wait Time', value: '18 min', icon: 'clock', data: [18, 17.8, 18.1, 18.2, 17.9, 18.0], label: 'Minutes' },
    { title: 'Active Counters', value: '12/15', icon: 'desktop', data: [12, 12, 13, 12.5, 13, 12.8], label: 'Counters' },
    { title: 'Active Users', value: 150, icon: '👥', data: [140, 145, 148, 147, 150, 152], label: 'Users' }
  ];

  charts: Chart[] = [];

  @ViewChildren('canvasElement') canvasElements!: QueryList<ElementRef>;

  currentPage: number = 1;
  totalPages: number = 5;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
  }

  ngAfterViewInit() {
    this.initializeCharts();
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  // Initialize Charts
  initializeCharts() {
    this.canvasElements.forEach((canvasElement, index) => {
      const ctx = canvasElement.nativeElement.getContext('2d');
      const metric = this.overallMetrics[index];

      // Create gradient for the line chart
      const gradient = ctx.createLinearGradient(0, 0, 0, 100);
      gradient.addColorStop(0, 'rgba(34, 193, 195, 0.2)');
      gradient.addColorStop(1, 'rgba(253, 187, 45, 0)');

      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Point 1', 'Point 2', 'Point 3', 'Point 4', 'Point 5', 'Point 6'],
          datasets: [{
            label: '', // Removed label for a clean display
            data: metric.data,
            fill: true,
            backgroundColor: gradient,
            borderColor: '#22C1C3',
            borderWidth: 2,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false // Hide legend for a cleaner look
            },
            tooltip: {
              enabled: true, // Show tooltips on hover
              callbacks: {
                label: (context) => {
                  return `Value: ${context.parsed.y}`; // Display the value on hover
                }
              }
            }
          },
          interaction: {
            mode: 'nearest', // Ensures the tooltip appears when hovering close to a point
            intersect: false
          },
          scales: {
            x: {
              display: false // Hide x-axis labels
            },
            y: {
              display: false // Hide y-axis labels
            }
          }
        }
      });
      this.charts.push(chart);
    });
  }

  // Destroy Charts to avoid memory leaks
  destroyCharts() {
    this.charts.forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });
  }

  // Pagination Controls
  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  toggleStaffDetails(staff: StaffPerformance) {
    staff.isExpanded = !staff.isExpanded;
    if (staff.isExpanded) {
      setTimeout(() => {
        this.initializeDailyPerformanceChart(staff);
      }, 0); // Wait for the expanded content to render before initializing the chart
    }
  }

  initializeDailyPerformanceChart(staff: StaffPerformance) {
    const canvasRef = this.dailyPerformanceCanvases.find((_, index) => this.paginatedStaffPerformance[index].name === staff.name);
    if (canvasRef) {
      const ctx = canvasRef.nativeElement.getContext('2d');

      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(34, 193, 195, 1)');
      gradient.addColorStop(1, 'rgba(253, 187, 45, 0.1)');

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          datasets: [{
            label: 'Daily Clients Served',
            data: [20, 30, 25, 40, 50, 30, 35], // Replace with relevant data
            backgroundColor: gradient,
            borderColor: '#22C1C3',
            borderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#22381F'
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(200, 200, 200, 0.2)'
              },
              ticks: {
                color: '#22381F'
              }
            }
          }
        }
      });
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
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
