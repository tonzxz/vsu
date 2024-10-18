import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, QueryList, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { QueueDisplayComponent } from '../../queueing-layout/queue-display/queue-display.component';
import { UswagonCoreService } from 'uswagon-core';
import { ContentService } from '../../../services/content.service';
import { UswagonAuthService } from 'uswagon-auth';

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
  imports: [CommonModule, QueueDisplayComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('canvasElement') canvasElements!: QueryList<ElementRef>;

  queueAnalytics$: Observable<QueueAnalytics[]> = of([]);
  staffPerformance$: Observable<StaffPerformance[]> = of([]);
  kioskStatus$: Observable<KioskStatus[]> = of([]);
  overallMetrics$: Observable<any[]> = of([]);

  currentUser!: { firstName: string; };
  isSuperAdmin:boolean = this.auth.accountLoggedIn() == 'superadmin';
  contents:any[]=[];
  divisions:any[] = [];
  charts: Chart[] = [];
  content:any;
  selectedDivision:string='';


  constructor(private API:UswagonCoreService, private contentService:ContentService, private auth:UswagonAuthService
  ) {}

  ngOnInit() {
    // Initialize currentUser with a mock value
    this.currentUser = { firstName: 'User' };

    this.loadContents();

    // Fetch mock data directly in the component
    this.queueAnalytics$ = this.getMockQueueAnalytics();
    this.staffPerformance$ = this.getMockStaffPerformance();
    this.kioskStatus$ = this.getMockKioskStatus();
    this.overallMetrics$ = this.getMockOverallMetrics();
  }

  ngAfterViewInit() {
    this.initializeCharts();
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  // Mock Data Functions
  getMockQueueAnalytics(): Observable<QueueAnalytics[]> {
    const queueAnalytics: QueueAnalytics[] = [
      { office: 'Registrar', currentTicket: 123, waitingCount: 10, avgWaitTime: '5 minutes', status: 'Busy' },
      { office: 'Cashier', currentTicket: 89, waitingCount: 5, avgWaitTime: '5 minutes', status: 'Moderate' },
      { office: 'Accounting Office', currentTicket: 45, waitingCount: 10, avgWaitTime: '5 minutes', status: 'Normal' }
    ];
    return of(queueAnalytics); // Simulate API call
  }

  getMockStaffPerformance(): Observable<StaffPerformance[]> {
    const staffPerformance: StaffPerformance[] = [
      { name: 'Jon Doe', office: 'Cashier', ticketsServed: 20, avgServiceTime: '10 mins', customerRating: 4.8, status: 'Active', isExpanded: false, dailyPerformance: [] },
      { name: 'Jane Doe', office: 'Registrar', ticketsServed: 25, avgServiceTime: '8 mins', customerRating: 4.9, status: 'Active', isExpanded: false, dailyPerformance: [] }
    ];
    return of(staffPerformance); // Simulate API call
  }

  getMockKioskStatus(): Observable<KioskStatus[]> {
    const kioskStatus: KioskStatus[] = [
      { id: 'K01', location: 'Main Hall', status: 'Operational', ticketsIssued: 500, lastMaintenance: '2023-09-20' },
      { id: 'K02', location: 'Branch A', status: 'Low Paper', ticketsIssued: 300, lastMaintenance: '2023-09-25' },
      { id: 'K03', location: 'Branch B', status: 'Out of Service', ticketsIssued: 0, lastMaintenance: '2023-09-10' }
    ];
    return of(kioskStatus); // Simulate API call
  }

  getMockOverallMetrics(): Observable<any[]> {
    const overallMetrics = [
      { title: 'Total Service provided', value: 43212, icon: 'ticket', data: [520, 525, 530, 528, 531, 529], label: 'Tickets' },
      { title: 'Average Service Time', value: '43,212', icon: 'clock', data: [18, 17.8, 18.1, 18.2, 17.9, 18.0], label: 'Minutes' },
      { title: 'Total Service provided Today', value: 1345, icon: 'desktop', data: [12, 12, 13, 12.5, 13, 12.8], label: 'Counters' },
      { title: 'Total Service provided This Week', value: 12124, icon: '👥', data: [140, 145, 148, 147, 150, 152], label: 'Users' }
    ];
    return of(overallMetrics); // Simulate API call
  }

  // Chart Initialization
  initializeCharts() {
    this.overallMetrics$.subscribe((metrics) => {
      this.canvasElements.forEach((canvasElement, index) => {
        const ctx = canvasElement.nativeElement.getContext('2d');
        const metric = metrics[index];

        const gradient = ctx.createLinearGradient(0, 0, 0, 100);
        gradient.addColorStop(0, 'rgba(34, 193, 195, 0.2)');
        gradient.addColorStop(1, 'rgba(253, 187, 45, 0)');

        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['June 1', 'June 8', 'June 15', 'June 22', 'June 29'],
            datasets: [{
              label: '',
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
                display: false
              },
              tooltip: {
                enabled: true,
                callbacks: {
                  label: (context) => {
                    return `Value: ${context.parsed.y}`;
                  }
                }
              }
            },
            interaction: {
              mode: 'nearest',
              intersect: false
            },
            scales: {
              x: { display: false },
              y: { display: false }
            }
          }
        });
        this.charts.push(chart);
      });
    });
  }

  async loadContents(){
    this.API.setLoading(true);
    if(this.isSuperAdmin){
      this.divisions = await this.contentService.getDivisions();
      this.contents = await this.contentService.getContentSettings();
      if(this.contents.length > 0){
        this.content = this.contents.find((content)=> content.division_id == this.divisions[0].id);
      }
      this.selectedDivision = this.divisions[0].id;
    }else{
      this.content = await this.contentService.getContentSetting();
    }
    this.API.setLoading(false);
  }

  changeContent(division_id:string){
    this.selectedDivision = division_id;
    this.content = this.contents.find((content)=> content.division_id == division_id);
  }

  // Destroy Charts
  destroyCharts() {
    this.charts.forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });
  }
}
