// content-mod.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../safe-url.pipe';

interface ContentUpdate {
  logoUrl: string;
  backgroundType: 'photo' | 'color';
  backgroundColor: string;
  backgroundPhotoUrl: string | null;
  videoUrl: string | null;
  announcementText: string;
  notesText: string;
}

@Component({
  selector: 'app-content-mod',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './content-mod.component.html',
  styleUrls: ['./content-mod.component.css']
})
export class ContentModComponent implements OnInit {
  currentDate: string = '';
  timer: string = '00:00:00';

  @Input() logoUrl: string = 'path/to/default/logo.png';
  @Input() backgroundType: 'photo' | 'color' = 'photo';
  @Input() backgroundColor: string = '#FFFFFF';
  @Input() backgroundPhotoUrl: string | null = null;
  @Input() videoUrl: string | null = null;
  @Input() announcementText: string = '';
  @Input() notesText: string = '';

  constructor() {}

  ngOnInit(): void {
    this.startTimer();
    this.updateCurrentDate();
  }

  updateContent(update: ContentUpdate): void {
    this.logoUrl = update.logoUrl;
    this.backgroundType = update.backgroundType;
    this.backgroundColor = update.backgroundColor;
    this.backgroundPhotoUrl = update.backgroundPhotoUrl;
    this.videoUrl = update.videoUrl;
    this.announcementText = update.announcementText;
    this.notesText = update.notesText;
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