import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../safe-url.pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-content-mod',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './content-mod.component.html',
  styleUrls: ['./content-mod.component.css']
})
export class ContentModComponent implements OnInit, AfterViewInit, OnChanges {
  // Input Properties for Content Customization
  @Input() logoUrl: string = 'path/to/default/logo.png';
  @Input() backgroundType: 'photo' | 'color' = 'photo';
  @Input() backgroundColor: string = '#283c1c';
  @Input() backgroundPhotoUrl: string | null = null;
  @Input() videoUrl: string | null = null;
  @Input() announcementText: string = '';
  @Input() notesText: string = '';
  @Input() tabName: string = 'Registrar';

  // New Input Properties for Color Customization
  @Input() textColor: string = '#000000';
  @Input() widgetsBackgroundColor: string = '#ffffff';
  @Input() processingContainerColor: string = '#283c1c';
  @Input() processingTextColor: string = '#ffffff';

  @Input() widgets: {
    weather: boolean;
    timeAndDate: boolean;
    currencyConverter: boolean;
  } = {
    weather: false,
    timeAndDate: false,
    currencyConverter: false,
  };

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  // State Variables
  currentDate: string = '';
  timer: string = '00:00:00';
  isPlaying: boolean = false;
  isLooping: boolean = false;
  youtubeSafeUrl: SafeResourceUrl | null = null;

  showAnnouncement: boolean = true;
  marqueeDuration: number = 0;
  notesDuration: number = 30; // Duration to display notes in seconds
  marqueeSpeed: number = 0.5; // Pixels per second (further reduced for better readability)
  maxCharCount: number = 200;
  announcementCycleCount: number = 0; // Track the number of announcement cycles
  announcementCyclesBeforeNotes: number = 3; // Number of announcement cycles before showing notes

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.startTimer();
    this.updateCurrentDate();
    this.updateVideoSource();
    this.updateMarqueeDuration();
  }

  ngAfterViewInit(): void {
    this.startContentCycle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['announcementText'] || changes['textColor']) {
      this.updateMarqueeDuration();
    }
    if (changes['videoUrl']) {
      this.updateVideoSource();
    }
  }

  /**
   * Update content based on the settings received from the parent component
   * @param update - Object containing all the settings
   */
  updateContent(update: {
    logoUrl: string;
    backgroundType: 'photo' | 'color';
    backgroundColor: string;
    backgroundPhotoUrl: string | null;
    videoUrl: string | null;
    announcementText: string;
    notesText: string;
    tabName: string;
    textColor: string;
    widgetsBackgroundColor: string;
    processingContainerColor: string;
    processingTextColor: string;
    widgets: {
      weather: boolean;
      timeAndDate: boolean;
      currencyConverter: boolean;
    };
  }): void {
    this.logoUrl = update.logoUrl;
    this.backgroundType = update.backgroundType;
    this.backgroundColor = update.backgroundColor;
    this.backgroundPhotoUrl = update.backgroundPhotoUrl;
    this.videoUrl = update.videoUrl;
    this.announcementText = update.announcementText;
    this.notesText = update.notesText;
    this.tabName = update.tabName;
    this.textColor = update.textColor;
    this.widgetsBackgroundColor = update.widgetsBackgroundColor;
    this.processingContainerColor = update.processingContainerColor;
    this.processingTextColor = update.processingTextColor;
    this.widgets = update.widgets;

    this.isPlaying = false;
    this.isLooping = false;
    this.updateVideoSource();
    this.updateMarqueeDuration();
    this.resetContentCycle();
  }

  /**
   * Update the video source based on whether it's a YouTube URL or a direct video file
   */
  updateVideoSource(): void {
    if (this.isYoutubeUrl(this.videoUrl)) {
      const videoId = this.getYouTubeVideoId(this.videoUrl!);
      const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`;
      this.youtubeSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else {
      this.youtubeSafeUrl = null;
    }
  }

  /**
   * Toggle play/pause for the video
   */
  togglePlay(): void {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      if (this.isPlaying) {
        this.videoPlayer.nativeElement.pause();
      } else {
        this.videoPlayer.nativeElement.play();
      }
      this.isPlaying = !this.isPlaying;
    }
  }

  /**
   * Toggle looping for the video
   */
  toggleLoop(): void {
    this.isLooping = !this.isLooping;
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.videoPlayer.nativeElement.loop = this.isLooping;
    }
  }

  /**
   * Restart the video from the beginning
   */
  restartVideo(): void {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.videoPlayer.nativeElement.currentTime = 0;
      this.videoPlayer.nativeElement.play();
      this.isPlaying = true;
    }
  }

  /**
   * Handle video ended event
   */
  onVideoEnded(): void {
    this.isPlaying = false;
    if (this.isLooping) {
      setTimeout(() => {
        if (this.videoPlayer && this.videoPlayer.nativeElement) {
          this.videoPlayer.nativeElement.currentTime = 0;
          this.videoPlayer.nativeElement.play();
          this.isPlaying = true;
        }
      }, 500);
    }
  }

  /**
   * Start the announcement and notes cycle
   */
  startContentCycle(): void {
    const cycleContent = () => {
      this.showAnnouncement = true;

      setTimeout(() => {
        this.announcementCycleCount++;
        if (this.announcementCycleCount >= this.announcementCyclesBeforeNotes) {
          this.showAnnouncement = false;
          setTimeout(() => {
            this.announcementCycleCount = 0; // Reset cycle count after showing notes
            cycleContent();
          }, this.notesDuration * 1000);
        } else {
          cycleContent();
        }
      }, this.marqueeDuration * 1000);
    };

    cycleContent();
  }

  /**
   * Reset the announcement and notes cycle
   */
  resetContentCycle(): void {
    this.announcementCycleCount = 0; // Reset the count
    this.showAnnouncement = true;
    this.startContentCycle();
  }

  /**
   * Check if the provided URL is a YouTube URL
   * @param url - The URL to check
   * @returns True if it's a YouTube URL, else False
   */
  isYoutubeUrl(url: string | null): boolean {
    return !!url && (url.includes('youtube.com') || url.includes('youtu.be'));
  }

  /**
   * Extract YouTube video ID from the URL
   * @param url - The YouTube URL
   * @returns The video ID
   */
  getYouTubeVideoId(url: string): string {
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1];
    }
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }
    return videoId;
  }

  /**
   * Sanitize URLs for safe embedding
   * @param url - The URL to sanitize
   * @returns The sanitized URL
   */
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
   * Continuously update the current date every second
   */
  private updateCurrentDate(): void {
    setInterval(() => {
      const now = new Date();
      this.currentDate = now.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }, 1000);
  }

  /**
   * Continuously update the current time every second
   */
  private startTimer(): void {
    setInterval(() => {
      const now = new Date();
      this.timer = now.toLocaleTimeString();
    }, 1000);
  }

  /**
   * Calculate the duration for the marquee animation based on text length and speed
   */
  private updateMarqueeDuration(): void {
    const containerWidth = 1000; // Assume a default container width of 1000px
    const textWidth = this.announcementText.length * 10; // Rough estimate of text width in pixels
    const totalDistance = containerWidth + textWidth;
    this.marqueeDuration = totalDistance / this.marqueeSpeed;
  }
}
