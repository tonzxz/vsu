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
import { QueueService } from '../../../services/queue.service';

interface Division{
  id:string;
  name:string;
}

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
  divisions: Division[] = [];
  charts: Chart[] = [];
  content: any;
  selectedDivision: string = '';
  selectedFilter: string = 'day';

  lastOverallTransaction?:number;
  dataLoaded: boolean = false;
  dashboardInterval:any;

  constructor(
    private API: UswagonCoreService,
    private divisionService: DivisionService,
    private contentService: ContentService,
    private queueService:QueueService,
    private auth: UswagonAuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = { firstName: 'User' };
    this.loadContents();
   
  }



  ngAfterViewInit() {
    this.updateOverallMetrics();
  }

  ngOnDestroy() {
    this.destroyCharts();
    if(this.dashboardInterval){
      clearInterval(this.dashboardInterval)
    }
  }

  getStatus(){
    const waiting = this.queueService.allTodayQueue.length;

    return waiting > 20 ? 'Busy' : waiting > 15 ? 'Moderate' : 'Normal'
  }

  getMockQueueAnalytics(): Observable<QueueAnalytics[]> {
    const perDivision = this.divisions.reduce((prev:any[],item)=>{
      return [...prev,
        {
          office: item.name,
          currentTicket:0,
          waitingCount: this.queueService.allTodayQueue.filter(queue=>queue.division_id == item.id).length,
          avgWaitTime: `${this.calculateWaitingTime(item.id)} minutes`,
          status: this.getStatus()
        }
        
      ]
    },[])
    return of([
      ...perDivision,
      { office: 'Total', currentTicket: 45, waitingCount: this.queueService.allTodayQueue.length, avgWaitTime: `${this.calculateWaitingTime()} minutes`, status: 'Busy' },
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

  async updateOverallMetrics() {

    const metrics =  this.getMockOverallMetrics();
    const updatedMetrics = metrics.map((metric) => ({
      ...metric,
      value: this.calculateMetricValue(metric.data),
    }));
    this.overallMetrics$ = of(updatedMetrics);
    this.overallMetrics$.pipe(take(1)).subscribe((metrics) => {
      this.destroyCharts();
      this.initializeCharts(metrics);
    });
  }

  calculateMetricValue(data: any): number {
    const filteredData = this.getFilteredData(data);
    return filteredData.reduce((acc: number, val: number) => acc + val, 0);
  }

  calculateWaitingTime(division_id?:string){
    let totalWaitingTime = 0;

    let items = this.queueService.attendedQueues;

    if(division_id){
      items = this.queueService.attendedQueues.filter(attended=>  attended.queue!.division_id == division_id);
    }

    let ignoredItems = 0;

    for (const record of items) {
        const waitingTime = (new Date(record.attended_on)).getTime() - (new Date(record.queue!.timestamp!)).getTime();
        if(waitingTime < 0){
          ignoredItems += 1;
        }else{
          totalWaitingTime += waitingTime;
        }
    }

    const averageWaitingTime = items.length == 0 ? 0 :totalWaitingTime / items.length - ignoredItems;

    // Convert milliseconds to a more readable format, e.g., minutes
    return (averageWaitingTime / (1000 * 60)).toFixed(2); // average waiting time in minutes
  }



  countItemsPerDay  (division_id?:string) {
    let items = this.queueService.allQueue;
    if(division_id){
      items = items.filter(item=> item.division_id == division_id);
    }
      const now = new Date();
      // Initialize an array with 24 zeros (for each hour)
      const countByHour = Array(24).fill(0);
      items.forEach(item => {
          const date = new Date(item.timestamp);
          const hour = date.getHours(); // Get the hour (0-23)
          // alert(date.toDateString());
          if(date.toDateString() == now.toDateString()){
            countByHour[hour]++;
          }
      });

      return countByHour;
  };

  countItemsPerWeek(division_id?:string) {
    let items = this.queueService.allQueue;
    if(division_id){
      items = items.filter(item=> item.division_id == division_id);
    }

    const today = new Date();
    const startOfPeriod = new Date(today);
    startOfPeriod.setDate(today.getDate() - 6); // Set to 7 days before today
  
    const countByDay: any = {};
  
    items.forEach((item: any) => {
      const date = new Date(item.timestamp);
  
      // Check if the item is within the last 8 days
      if (date >= startOfPeriod && date <= today) {
        const dayKey = date.toISOString().split('T')[0]; // Use ISO string to get YYYY-MM-DD format
  
        countByDay[dayKey] = (countByDay[dayKey] || 0) + 1; // Increment the count for that day
      }
    });
  
    // Create an array of days in the correct order
    const result = [];
    for (let i = 7; i >= 0; i--) { // Iterate from 7 days ago to today
      const day = new Date();
      day.setDate(today.getDate() - i);
      const dayKey = day.toISOString().split('T')[0]; // Get YYYY-MM-DD format
  
      result.push(countByDay[dayKey] || 0); // Push the count or 0 if no items for that day
    }
  
    return result;
  }

  countItemsPerMonth(division_id?:string) {
    let items = this.queueService.allQueue;
    if(division_id){
      items = items.filter(item=> item.division_id == division_id);
    }
    const countByWeek: any = {};
    const now = new Date();
    items.forEach((item: any) => {
        const date = new Date(item.timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month and pad with zero
        
        if(year == now.getFullYear() && month ==  String(now.getMonth() + 1).padStart(2, '0')){
          // Get the week number of the month
          const week = Math.ceil((date.getDate() + 6) / 7); // Calculate week number (1-4)
          const weekKey = `${year}-${month}-W${week}`; // Create a key for the week
  
          countByWeek[weekKey] = (countByWeek[weekKey] || 0) + 1; // Increment the count for that week
        }

    });
  
    return Object.values(countByWeek);
  }
  countItemsPerYear(division_id?:string) {
    let items = this.queueService.allQueue;
    if(division_id){
      items = items.filter(item=> item.division_id == division_id);
    }
    
    const countByMonth = new Array(12).fill(0); // Create an array with 12 months initialized to 0
    const now = new Date();
    // Iterate over each item to count occurrences by month
    items.forEach((item) => {
      const date = new Date(item.timestamp);
      const month = date.getMonth(); // Get month (0-11)
      if(date.getFullYear() == now.getFullYear()){
        countByMonth[month] += 1; // Increment the count for that month
      }
    });

    return countByMonth;

  }

  getMockOverallMetrics() {
    const perDivision = this.divisions.reduce((prev:any[],item)=>{
      return [
        ...prev,
        {
          title: item.name,
          value:0,
          data:{
            day: this.countItemsPerDay(item.id),
            week: this.countItemsPerWeek(item.id),
            month:this.countItemsPerMonth(item.id),
            year: this.countItemsPerYear(item.id),
          }
          
        }
      ];
    },[]);
    return [
      {
        title: 'Total Transactions',
        value: 0,
        data: {
          day: this.countItemsPerDay(),
          week: this.countItemsPerWeek(),
          month:this.countItemsPerMonth(),
          year: this.countItemsPerYear(),
        },
      },
      ...perDivision
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
    await this.queueService.getAllQueues();
    await this.queueService.getAllTodayQueues();
    await this.queueService.geAllAttendedQueues();
    this.queueAnalytics$ = this.getMockQueueAnalytics();
    this.staffPerformance$ = this.getMockStaffPerformance();
    this.kioskStatus$ = this.getMockKioskStatus();
    this.updateOverallMetrics();
    this.updateKioskPagination();
    this.API.setLoading(false);
    if(this.dashboardInterval){
      clearInterval(this.dashboardInterval)
    }
    this.dashboardInterval = setInterval( async()=>{
      await this.queueService.getAllQueues();
      await this.queueService.getAllTodayQueues();
      this.queueAnalytics$ = this.getMockQueueAnalytics();
      this.staffPerformance$ = this.getMockStaffPerformance();
      this.kioskStatus$ = this.getMockKioskStatus();
      this.updateKioskPagination();
      if(this.lastOverallTransaction !== this.queueService.allQueue.length){
        this.lastOverallTransaction = this.queueService.allQueue.length;
        this.updateOverallMetrics();
      }
      
      if(!this.dataLoaded){
        this.dataLoaded = true;
       
      }
    },2000)

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