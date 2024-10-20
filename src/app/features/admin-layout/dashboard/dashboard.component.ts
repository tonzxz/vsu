import { Component, OnInit, OnDestroy, ViewChildren, ElementRef, QueryList, ChangeDetectorRef } from '@angular/core';
import { Observable, of, take } from 'rxjs';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QueueDisplayComponent } from '../../queueing-layout/queue-display/queue-display.component';
import { UswagonCoreService } from 'uswagon-core';
import { ContentService } from '../../../services/content.service';
import { UswagonAuthService } from 'uswagon-auth';
import { DivisionService } from '../../../services/division.service';

interface QueueAnalytics {
  office: string;
  currentTicket: number;
  waitingCount: number;
  avgWaitTime: string;
  status: string;
}

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
  imports: [CommonModule, FormsModule, QueueDisplayComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChildren('canvasElement') canvasElements!: QueryList<ElementRef>;

  queueAnalytics$: Observable<QueueAnalytics[]> = of([]);
  staffPerformance$: Observable<StaffPerformance[]> = of([]);
  kioskStatus$: Observable<KioskStatus[]> = of([]);
  overallMetrics$: Observable<any[]> = of([]);

  currentUser!: { firstName: string };
  isSuperAdmin: boolean = this.auth.accountLoggedIn() === 'superadmin';
  contents: any[] = [];
  divisions: any[] = [];
  charts: Chart[] = [];
  content: any;
  selectedDivision: string = '';
  selectedFilter: string = 'day';

  constructor(
    private API: UswagonCoreService,
    private divisionService:DivisionService,
    private contentService: ContentService,
    private auth: UswagonAuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = { firstName: 'User' };
    this.loadContents();
    this.queueAnalytics$ = this.getMockQueueAnalytics();
    this.staffPerformance$ = this.getMockStaffPerformance();
    this.kioskStatus$ = this.getMockKioskStatus();
    this.overallMetrics$ = this.getMockOverallMetrics();

    // Subscribe to the overallMetrics$ and initialize the charts when data is available.
    this.overallMetrics$.pipe(take(1)).subscribe((metrics) => {
      if (metrics && metrics.length > 0) {
        this.initializeCharts(metrics);
      } else {
        console.warn('No metrics data available to initialize charts.');
      }
    });
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  getMockQueueAnalytics(): Observable<QueueAnalytics[]> {
    const queueAnalytics: QueueAnalytics[] = [
      { office: 'Registrar', currentTicket: 123, waitingCount: 10, avgWaitTime: '5 minutes', status: 'Busy' },
      { office: 'Cashier', currentTicket: 89, waitingCount: 5, avgWaitTime: '5 minutes', status: 'Moderate' },
      { office: 'Accounting Office', currentTicket: 45, waitingCount: 10, avgWaitTime: '5 minutes', status: 'Normal' },
      { office: 'Total', currentTicket: 257, waitingCount: 25, avgWaitTime: '5 minutes', status: 'Busy' }
    ];
    return of(queueAnalytics);
  }

  getMockStaffPerformance(): Observable<StaffPerformance[]> {
    const staffPerformance: StaffPerformance[] = [
      { name: 'Jon Doe', office: 'Cashier', ticketsServed: 20, avgServiceTime: '10 mins', customerRating: 4.8, status: 'Active', isExpanded: false, dailyPerformance: [] },
      { name: 'Jane Doe', office: 'Registrar', ticketsServed: 25, avgServiceTime: '8 mins', customerRating: 4.9, status: 'Active', isExpanded: false, dailyPerformance: [] }
    ];
    return of(staffPerformance);
  }

  getMockKioskStatus(): Observable<KioskStatus[]> {
    const kioskStatus: KioskStatus[] = [
      { id: 'K01', location: 'Main Hall', status: 'Operational', ticketsIssued: 500, lastMaintenance: '2023-09-20' },
      { id: 'K02', location: 'Branch A', status: 'Low Paper', ticketsIssued: 300, lastMaintenance: '2023-09-25' },
      { id: 'K03', location: 'Branch B', status: 'Out of Service', ticketsIssued: 0, lastMaintenance: '2023-09-10' }
    ];
    return of(kioskStatus);
  }

  getMockOverallMetrics(): Observable<any[]> {
    const overallMetrics = [
      { title: 'Total Service provided', value: 43212, data: [520, 525, 530, 528, 531, 529, 524] },
      { title: 'Average Service Time', value: '43,212', data: [18, 17.8, 18.1, 18.2, 17.9, 18.0, 17.8] },
      { title: 'Total Service provided Today', value: 1345, data: [12, 12, 13, 12.5, 13, 12.8, 13.2] },
      { title: 'Total Service provided This Week', value: 12124, data: [140, 145, 148, 147, 150, 152, 155] }
    ];
    return of(overallMetrics);
  }

  initializeCharts(metrics: any[]) {
    this.canvasElements.forEach((canvasElement, index) => {
      const ctx = canvasElement.nativeElement.getContext('2d');
      const metric = metrics[index];
      const labels = this.getFilteredLabels();

      if (!metric || !metric.data) {
        console.warn('Metric data is missing:', metric);
        return;
      }

      const gradient = ctx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(0, 'rgba(34, 193, 195, 0.3)');
      gradient.addColorStop(1, 'rgba(253, 187, 45, 0.1)');

      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: metric.title,
            data: this.getFilteredData(metric.data),
            fill: true,
            backgroundColor: gradient,
            borderColor: '#22C1C3',
            borderWidth: 3,
            pointBackgroundColor: '#22C1C3',
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#333',
                font: {
                  size: 14
                }
              }
            },
            tooltip: {
              backgroundColor: '#f5f5f5',
              bodyColor: '#333',
              borderColor: '#ddd',
              borderWidth: 1,
              titleColor: '#666',
              callbacks: {
                label: (context) => ` ${context.dataset.label}: ${context.parsed.y}`
              }
            }
          },
          scales: {
            x: {
              display: true,
              ticks: {
                color: '#555',
                font: {
                  size: 12
                }
              },
              grid: {
                color: 'rgba(200, 200, 200, 0.2)' // Lighter grid lines
              }
            },
            y: {
              display: true,
              ticks: {
                color: '#555',
                font: {
                  size: 12
                }
              },
              grid: {
                color: 'rgba(200, 200, 200, 0.2)' // Lighter grid lines
              }
            }
          }
        }
      });

      this.charts.push(chart);
    });
  }

  getFilteredLabels(): string[] {
    if (this.selectedFilter === 'day') {
      return ['Today'];
    } else if (this.selectedFilter === 'week') {
      return this.getLast7Days();
    } else if (this.selectedFilter === 'month') {
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    } else {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
  }

  getFilteredData(data: number[]): number[] {
    if (this.selectedFilter === 'day') {
      return [data[data.length - 1]];
    } else if (this.selectedFilter === 'week') {
      return data.slice(-7);
    } else if (this.selectedFilter === 'month') {
      return data.slice(-4);
    } else {
      return data.slice(-12);
    }
  }

  getLast7Days(): string[] {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return days;
  }

  async loadContents() {
    this.API.setLoading(true);
    if (this.isSuperAdmin) {
      this.selectedDivision = (await this.divisionService.getDivision())!.id ;
      this.divisions = this.divisionService.divisions;
      this.contents = await this.contentService.getContentSettings();
      if (this.contents.length > 0) {
        this.content = this.contents.find(content => content.division_id === this.divisions[0].id);
      }
      
    } else {
      this.content = await this.contentService.getContentSetting();
    }
    this.API.setLoading(false);
    this.cdr.detectChanges();
  }

  changeContent(division_id: string) {
    this.selectedDivision = division_id;
    this.content = this.contents.find(content => content.division_id === division_id);
    this.cdr.detectChanges();
  }

  destroyCharts() {
    this.charts.forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });
  }

  onFilterChange() {
    this.overallMetrics$.pipe(take(1)).subscribe((metrics) => {
      this.destroyCharts();
      this.initializeCharts(metrics);
    });
  }
}
