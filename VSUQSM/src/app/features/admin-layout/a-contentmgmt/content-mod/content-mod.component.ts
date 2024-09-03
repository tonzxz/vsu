import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-mod',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-mod.component.html',
  styleUrls: ['./content-mod.component.css']
})
export class ContentModComponent implements OnInit {
  currentDate: string = '';
  timer: string = '00:00:00';

  constructor() {}

  ngOnInit(): void {
    this.startTimer();
    this.updateCurrentDate();
  }

  private updateCurrentDate(): void {
    setInterval(() => {
      const now = new Date();
      this.currentDate = now.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }, 1000);
  }

  private startTimer(): void {
    setInterval(() => {
      const now = new Date();
      this.timer = now.toTimeString().split(' ')[0];
    }, 1000);
  }
}
