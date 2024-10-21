import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  ElementRef,
  QueryList,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
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
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('canvasElement') canvasElements!: QueryList<ElementRef>;

  queueAnalytics$: Observable<QueueAnalytics[]> = of([]);
  staffPerformance$: Observable<StaffPerformance[]> = of([]);
  kioskStatus$: Observable<KioskStatus[]> = of([]);
  overallMetrics$: Observable<any[]> = of([]);

  paginatedKioskStatus: KioskStatus[] = [];
  kioskCurrentPage: number = 1;
  kioskItemsPerPage: number = 8;
  totalKioskPages: number = 1;

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
    private divisionService: DivisionService,
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
    this.updateOverallMetrics();
    this.updateKioskPagination();
  }

  ngAfterViewInit() {
    this.updateOverallMetrics();
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
    return of([
      { office: 'Registrar', currentTicket: 123, waitingCount: 10, avgWaitTime: '5 minutes', status: 'Busy' },
      { office: 'Cashier', currentTicket: 89, waitingCount: 5, avgWaitTime: '5 minutes', status: 'Moderate' },
      { office: 'Accounting Office', currentTicket: 45, waitingCount: 10, avgWaitTime: '5 minutes', status: 'Normal' },
      { office: 'Total', currentTicket: 257, waitingCount: 25, avgWaitTime: '5 minutes', status: 'Busy' },
    ]);
  }

  getMockStaffPerformance(): Observable<StaffPerformance[]> {
    return of([
      { name: 'Jon Doe', office: 'Cashier', ticketsServed: 20, avgServiceTime: '10 mins', customerRating: 4.8, status: 'Active', isExpanded: false, dailyPerformance: [] },
      { name: 'Jane Doe', office: 'Registrar', ticketsServed: 25, avgServiceTime: '8 mins', customerRating: 4.9, status: 'Active', isExpanded: false, dailyPerformance: [] },
      { name: 'Alice Smith', office: 'Accounting', ticketsServed: 18, avgServiceTime: '12 mins', customerRating: 4.7, status: 'Active', isExpanded: false, dailyPerformance: [] },
      { name: 'Bob Johnson', office: 'Cashier', ticketsServed: 22, avgServiceTime: '9 mins', customerRating: 4.6, status: 'Active', isExpanded: false, dailyPerformance: [] },
      { name: 'Charlie Brown', office: 'Registrar', ticketsServed: 23, avgServiceTime: '11 mins', customerRating: 4.5, status: 'Active', isExpanded: false, dailyPerformance: [] },
    ]);
  }

  getMockKioskStatus(): Observable<KioskStatus[]> {
    return of([
      { id: 'K01', location: 'Main Hall', status: 'Operational', ticketsIssued: 500, lastMaintenance: '2023-09-20' },
      { id: 'K02', location: 'Branch A', status: 'Low Paper', ticketsIssued: 300, lastMaintenance: '2023-09-25' },
      { id: 'K03', location: 'Branch B', status: 'Out of Service', ticketsIssued: 0, lastMaintenance: '2023-09-10' },
      { id: 'K04', location: 'Branch C', status: 'Operational', ticketsIssued: 700, lastMaintenance: '2023-10-01' },
      { id: 'K05', location: 'Branch D', status: 'Operational', ticketsIssued: 650, lastMaintenance: '2023-10-05' },
      { id: 'K06', location: 'Branch E', status: 'Out of Service', ticketsIssued: 0, lastMaintenance: '2023-10-15' },
      { id: 'K07', location: 'Branch F', status: 'Operational', ticketsIssued: 450, lastMaintenance: '2023-10-20' },
      { id: 'K08', location: 'Branch G', status: 'Low Paper', ticketsIssued: 200, lastMaintenance: '2023-10-22' },
      { id: 'K09', location: 'Branch H', status: 'Operational', ticketsIssued: 550, lastMaintenance: '2023-10-25' },
      { id: 'K10', location: 'Branch I', status: 'Operational', ticketsIssued: 400, lastMaintenance: '2023-10-28' },
      
    ]);
  }

  updateOverallMetrics() {
    const metrics = this.getMockOverallMetrics();
    const updatedMetrics = metrics.map((metric) => ({
      ...metric,
      value: this.calculateMetricValue(metric.data),
    }));
    this.overallMetrics$ = of(updatedMetrics);
  }

  calculateMetricValue(data: any): number {
    const filteredData = this.getFilteredData(data);
    return filteredData.reduce((acc: number, val: number) => acc + val, 0);
  }

  getMockOverallMetrics(): any[] {
    return [
      {
        title: 'Total Transactions',
        value: 0,
        data: {
          day: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50)),
          week: [520, 525, 530, 528, 531, 529, 524],
          month: [1300, 1400, 1500, 1600],
          year: [12000, 12500, 13000, 14000, 15000, 15500, 16000, 17000, 18000, 19000, 20000, 21000],
        },
      },
      {
        title: 'Cashier',
        value: 0,
        data: {
          day: Array.from({ length: 24 }, () => Math.floor(Math.random() * 20)),
          week: [200, 205, 210, 208, 212, 209, 204],
          month: [500, 550, 600, 650],
          year: [4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100, 6300, 6500, 6700],
        },
      },
      {
        title: 'Registrar',
        value: 0,
        data: {
          day: Array.from({ length: 24 }, () => Math.floor(Math.random() * 15)),
          week: [300, 305, 310, 308, 312, 309, 304],
          month: [700, 750, 800, 850],
          year: [6000, 6200, 6400, 6600, 6800, 7000, 7200, 7400, 7600, 7800, 8000, 8200],
        },
      },
      {
        title: 'Accounting',
        value: 0,
        data: {
          day: Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)),
          week: [220, 225, 230, 228, 231, 229, 224],
          month: [550, 600, 650, 700],
          year: [5000, 5200, 5400, 5600, 5800, 6000, 6200, 6400, 6600, 6800, 7000, 7200],
        },
      },
    ];
  }

  getFilteredData(data: any): number[] {
    if (this.selectedFilter === 'day') {
      return data.day;
    } else if (this.selectedFilter === 'week') {
      return data.week;
    } else if (this.selectedFilter === 'month') {
      return data.month;
    } else {
      return data.year;
    }
  }

  initializeCharts(metrics: any[]) {
    this.destroyCharts();

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
            tension: 0.4,
          }],
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
                  size: 14,
                },
              },
            },
            tooltip: {
              backgroundColor: '#f5f5f5',
              bodyColor: '#333',
              borderColor: '#ddd',
              borderWidth: 1,
              titleColor: '#666',
            },
          },
          scales: {
            x: {
              display: true,
              ticks: {
                color: '#555',
                font: {
                  size: 12,
                },
              },
              grid: {
                color: 'rgba(200, 200, 200, 0.2)',
              },
            },
            y: {
              display: true,
              ticks: {
                color: '#555',
                font: {
                  size: 12,
                },
              },
              grid: {
                color: 'rgba(200, 200, 200, 0.2)',
              },
            },
          },
        },
      });

      this.charts.push(chart);
    });
  }

  getFilteredLabels(): string[] {
    if (this.selectedFilter === 'day') {
      return Array.from({ length: 24 }, (_, i) => `${i}:00`);
    } else if (this.selectedFilter === 'week') {
      return this.getLast7Days();
    } else if (this.selectedFilter === 'month') {
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    } else {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
      this.selectedDivision = (await this.divisionService.getDivision())!.id;
      this.divisions = this.divisionService.divisions;
      this.contents = await this.contentService.getContentSettings();
      if (this.contents.length > 0) {
        this.content = this.contents.find(content => content.division_id === this.selectedDivision);
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
    this.charts = [];
  }

  onFilterChange() {
    this.updateOverallMetrics();
    this.overallMetrics$.pipe(take(1)).subscribe((metrics) => {
      this.destroyCharts();
      this.initializeCharts(metrics);
    });
  }

  updateKioskPagination() {
    this.kioskStatus$.pipe(take(1)).subscribe(kioskData => {
      const start = (this.kioskCurrentPage - 1) * this.kioskItemsPerPage;
      const end = start + this.kioskItemsPerPage;
      this.paginatedKioskStatus = kioskData.slice(start, end);
      this.totalKioskPages = Math.ceil(kioskData.length / this.kioskItemsPerPage);
    });
  }

  onKioskPageChange(direction: 'prev' | 'next') {
    if (direction === 'prev' && this.kioskCurrentPage > 1) {
      this.kioskCurrentPage--;
    } else if (direction === 'next' && this.kioskCurrentPage < this.totalKioskPages) {
      this.kioskCurrentPage++;
    }
    this.updateKioskPagination();
  }
}