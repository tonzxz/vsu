import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Metric {
  label: string;
  value: string;
}

interface ServiceTime {
  range: string;
  percentage: number;
}

interface DailyCustomer {
  date: string;
  count: number;
}

@Component({
  selector: 'app-da-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './da-dashboard.component.html',
  styleUrls: ['./da-dashboard.component.css']
})
export class DaDashboardComponent implements OnInit, OnDestroy {
  userName: string = 'Emily';
  selectedTimeRange: string = 'day';
  metrics: Metric[] = [];
  serviceTimeDistribution: ServiceTime[] = [];
  dailyCustomerServed: DailyCustomer[] = [];
  maxDailyCount: number = 0;
  minDailyCount: number = 0;
  graphWidth: number = 600;
  graphHeight: number = 200;
  private updateInterval: any;

  ngOnInit() {
    this.generateRandomData();
    this.updateInterval = setInterval(() => this.generateRandomData(), 5000); // Update every 5 seconds
  }

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  onTimeRangeChange() {
    this.generateRandomData();
  }

  generateRandomData() {
    this.metrics = [
      { label: "Total Customers Served", value: this.randomInt(1000, 5000).toString() + 'K' },
      { label: "Average Service Time (mins)", value: this.randomFloat(5, 15).toFixed(1) },
      { label: "Customer Satisfaction", value: this.randomFloat(3, 5).toFixed(1) },
      { label: "Queue Efficiency", value: this.randomInt(80, 100).toString() + '%' }
    ];

    this.serviceTimeDistribution = [
      { range: "5-10 mins", percentage: this.randomInt(60, 80) },
      { range: "10-15 mins", percentage: this.randomInt(10, 25) },
      { range: "15-20 mins", percentage: this.randomInt(5, 15) },
      { range: "20+ mins", percentage: this.randomInt(1, 5) }
    ];

    const dates = ['Jul 1', 'Jul 2', 'Jul 3', 'Jul 4', 'Jul 5', 'Jul 6', 'Jul 7'];
    this.dailyCustomerServed = dates.map(date => ({
      date,
      count: this.randomInt(50, 200)
    }));
    this.maxDailyCount = Math.max(...this.dailyCustomerServed.map(day => day.count));
    this.minDailyCount = Math.min(...this.dailyCustomerServed.map(day => day.count));
  }

  getPointsForLineGraph(): string {
    const xStep = this.graphWidth / (this.dailyCustomerServed.length - 1);
    return this.dailyCustomerServed.map((day, index) => {
      const x = index * xStep;
      const y = this.graphHeight - ((day.count - this.minDailyCount) / (this.maxDailyCount - this.minDailyCount)) * this.graphHeight;
      return `${x},${y}`;
    }).join(' ');
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}