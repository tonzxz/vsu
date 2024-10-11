import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CurrencyService } from '../../../services/currency.service';

interface Counter {
  label: string;
  ticketNumber: string;
  personName: string;
}

interface UpNextItem {
  avatar: string;
  ticketNumber: string;
  personName: string;
}

interface WeatherItem {
  time: string;
  temperature: number;
}

interface CurrencyInfo {
  label: string;
  rate: number;
}

@Component({
  standalone: true,
  selector: 'app-queue-display',
  imports: [RouterModule, CommonModule],
  templateUrl: './queue-display.component.html',
  styleUrls: ['./queue-display.component.css']
})
export class QueueDisplayComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>; // Access video element
  logoUrl = '/assets/logo/vsu.png';

  // Variables for user-defined backgrounds
  backgroundImageUrl = '/assets/queue-display/background.png'; 
  backgroundColor: string = '#4a4a4a'; 
  backgroundType: number = 0; 

  // Control flags: 1 is "on", 0 is "off"
  showTime: number = 1;
  showWeather: number = 1;
  showCurrency: number = 1;

  // Mock data for queue
  counters: Counter[] = [
    { label: 'COUNTER 1', ticketNumber: 'P-312314', personName: 'Domeng Valdez' },
    { label: 'COUNTER 2', ticketNumber: 'R-312314', personName: 'Burnok Binawian' },
    { label: 'COUNTER 3', ticketNumber: 'R-312315', personName: 'John Doe' },
    { label: 'COUNTER 4', ticketNumber: 'P-312316', personName: 'Jane Doe' },
    { label: 'COUNTER 5', ticketNumber: 'R-312317', personName: 'Alice Johnson' },
    { label: 'COUNTER 6', ticketNumber: 'P-312318', personName: 'Bob Brown' },
    { label: 'COUNTER 7', ticketNumber: 'R-312319', personName: 'Charlie White' }
  ];

  upNextItems: UpNextItem[] = [
    { avatar: '/assets/queue-display/Male_2.png', ticketNumber: 'P-217', personName: 'Kristin Watson' },
    { avatar: '/assets/queue-display/Male_1.png', ticketNumber: 'P-218', personName: 'Al Francis Salceda' },
    { avatar: '/assets/queue-display/Female_2.png', ticketNumber: 'R-247', personName: 'Joey Bichara' },
    { avatar: '/assets/queue-display/female_1.png', ticketNumber: 'R-217', personName: 'Kenneth Felix Belga' }
  ];

  weatherItems: WeatherItem[] = [
    { time: '12:00 PM', temperature: 40 },
    { time: '2:00 PM', temperature: 38 },
    { time: '4:00 PM', temperature: 30 }
  ];

  currencies: CurrencyInfo[] = [
    { label: 'USD', rate: 0 }, 
    { label: 'CNY', rate: 0 },
    { label: 'GBP', rate: 0 },
    { label: 'JPY', rate: 0 }
  ];
  currentCurrencyIndex = 0;
  currentCurrency: CurrencyInfo = this.currencies[this.currentCurrencyIndex];
  timeInfo = { location: 'Manila (GMT +8)', time: '' };
  pesoAmount: number = 1; 
  
  // Video-related variables
  showVideo: boolean = false; 
  videoUrl: string = 'assets/queue-display/vsu.mp4'; 
  videoCurrentTime: number = 0; 

  constructor(private currencyService: CurrencyService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);

    // Fetch real-time currency data from CurrencyFreaks
    this.currencyService.getCurrencyData().subscribe({
      next: (data) => {
        this.currencies = [
          { label: 'USD', rate: +data.rates.USD },
          { label: 'CNY', rate: +data.rates.CNY },
          { label: 'GBP', rate: +data.rates.GBP },
          { label: 'JPY', rate: +data.rates.JPY }
        ];
      },
      error: (error) => {
        console.error('Currency API Error:', error);
        console.log('Detailed Error Response:', error.error);
      }
    });

    
    setInterval(() => {
      this.toggleVideoUpNext();
    }, 5000); 

        setInterval(() => this.updateCurrency(), 2000);
  }

  ngAfterViewInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  updateTime(): void {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    this.timeInfo.time = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
  }

  updateCurrency(): void {
    this.currentCurrencyIndex = (this.currentCurrencyIndex + 1) % this.currencies.length;
    this.currentCurrency = this.currencies[this.currentCurrencyIndex];
  }

  toggleVideoUpNext(): void {
    this.showVideo = !this.showVideo;

    if (this.showVideo) {
      // Show video and resume playback
      if (this.videoPlayer && this.videoPlayer.nativeElement.paused) {
        this.videoPlayer.nativeElement.currentTime = this.videoCurrentTime;
        this.videoPlayer.nativeElement.play(); // Resume playing the video
      }
    } else {
      // Switch to "Up Next" and pause the video
      if (this.videoPlayer) {
        this.videoCurrentTime = this.videoPlayer.nativeElement.currentTime;
        this.videoPlayer.nativeElement.pause(); // Pause the video
      }
    }
  }

  // Function to handle background image or color based on backgroundType
  getBackgroundStyle(): string {
    return this.backgroundType === 1
      ? `url(${this.backgroundImageUrl})`
      : this.backgroundColor;
  }
}




