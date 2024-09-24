import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
export class ContentModComponent implements OnInit, AfterViewInit {
  @Input() logoUrl: string = 'path/to/default/logo.png';
  @Input() backgroundType: 'photo' | 'color' = 'photo';
  @Input() backgroundColor: string = '#FFFFFF';
  @Input() backgroundPhotoUrl: string | null = null;
  @Input() videoUrl: string | null = null;
  @Input() announcementText: string = '';
  @Input() notesText: string = '';
  @Input() tabName: string = 'Registrar';

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('marqueeText') marqueeText!: ElementRef;

  currentDate: string = '';
  timer: string = '00:00:00';
  isPlaying: boolean = false;
  isLooping: boolean = false;
  youtubeSafeUrl: SafeResourceUrl | null = null;

  showAnnouncement: boolean = true;
  marqueeDuration: number = 10; // Duration for one cycle of the announcement
  notesDuration: number = 5; // Duration to display notes in seconds

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.startTimer();
    this.updateCurrentDate();
    this.updateVideoSource();
  }

  ngAfterViewInit(): void {
    this.startContentCycle();
  }

  /**
   * Update content dynamically.
   * This can be invoked when new content updates need to be applied.
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
  }): void {
    this.logoUrl = update.logoUrl;
    this.backgroundType = update.backgroundType;
    this.backgroundColor = update.backgroundColor;
    this.backgroundPhotoUrl = update.backgroundPhotoUrl;
    this.videoUrl = update.videoUrl;
    this.announcementText = update.announcementText;
    this.notesText = update.notesText;
    this.tabName = update.tabName;
    
    this.isPlaying = false;
    this.isLooping = false;
    this.updateVideoSource();
    this.resetContentCycle();
  }

  /**
   * Update the video source depending on if it's a YouTube video or not.
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
   * Play or pause the video.
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
   * Toggle video looping on or off.
   */
  toggleLoop(): void {
    this.isLooping = !this.isLooping;
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.videoPlayer.nativeElement.loop = this.isLooping;
    }
  }

  /**
   * Restart the video from the beginning.
   */
  restartVideo(): void {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.videoPlayer.nativeElement.currentTime = 0;
      this.videoPlayer.nativeElement.play();
      this.isPlaying = true;
    }
  }

  /**
   * Handle what happens when the video ends.
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
   * Start the content cycle to switch between announcements and notes.
   */
  startContentCycle(): void {
    const cycleContent = () => {
      this.showAnnouncement = true;
      setTimeout(() => {
        this.showAnnouncement = false;
        setTimeout(() => {
          cycleContent();
        }, this.notesDuration * 1000);
      }, this.marqueeDuration * 1000);
    };

    cycleContent();
  }

  /**
   * Reset the content cycle to start showing announcements again.
   */
  resetContentCycle(): void {
    this.showAnnouncement = true;
    this.startContentCycle();
  }

  /**
   * Check if the provided URL is a YouTube URL.
   */
  isYoutubeUrl(url: string | null): boolean {
    return !!url && (url.includes('youtube.com') || url.includes('youtu.be'));
  }

  /**
   * Extract the YouTube video ID from the URL.
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
   * Return a safe URL for the video.
   */
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
   * Update the current date display.
   */
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

  /**
   * Start a timer that updates every second.
   */
  private startTimer(): void {
    setInterval(() => {
      const now = new Date();
      this.timer = now.toTimeString().split(' ')[0];
    }, 1000);
  }
}