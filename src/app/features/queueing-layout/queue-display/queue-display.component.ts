import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ThirdPartyService } from '../../../services/thirdparty.service';
import { LottieAnimationComponent } from '../../../shared/components/lottie-animation/lottie-animation.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  icon:string;
}

interface Colors {
  primary_bg: string;
  secondary_bg: string;
  tertiary_bg:string;
  primary_text: string;
  secondary_text: string;
  tertiary_text:string;

}

@Component({
  standalone: true,
  selector: 'app-queue-display',
  imports: [RouterModule, CommonModule, LottieAnimationComponent],
  templateUrl: './queue-display.component.html',
  styleUrls: ['./queue-display.component.css']
})
export class QueueDisplayComponent implements OnInit, AfterViewInit, OnChanges {
 
 
  @Input() title = 'Registrar Division';
 
  @Input() colors:Colors = {
    primary_bg: '#2F4A2C',
    secondary_bg: '#2F4A2C',
    tertiary_bg: '#2F4A2C',
    primary_text: '#2F4A2C',
    secondary_text: '#2F4A2C',
    tertiary_text: '#2F4A2C',
  }

  // Mock data for queue
  @Input() counters: Counter[] = [
    { label: 'COUNTER 1', ticketNumber: 'P-312314', personName: 'Domeng Valdez' },
    { label: 'COUNTER 2', ticketNumber: 'R-312314', personName: 'Burnok Binawian' },
    { label: 'COUNTER 3', ticketNumber: 'R-312315', personName: 'John Doe' },
    { label: 'COUNTER 4', ticketNumber: 'P-312316', personName: 'Jane Doe' },
    { label: 'COUNTER 5', ticketNumber: 'R-312317', personName: 'Alice Johnson' },
    { label: 'COUNTER 6', ticketNumber: 'P-312318', personName: 'Bob Brown' },
    { label: 'COUNTER 7', ticketNumber: 'R-312319', personName: 'Charlie White' }
  ];


  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>; // Access video element
  @ViewChild('iframePlayer') iframePlayer!: ElementRef<HTMLIFrameElement>; // Access video element
  // Variables for user-defined backgrounds
  @Input() isPreview = false;


  @Input() showTime: boolean = true;
  @Input() showWeather: boolean = true;
  @Input() showCurrency: boolean = true;
  @Input() showAnnouncement: boolean = true;
  @Input() showBackground:boolean = true;
  @Input() announcements:string = '';
  @Input() logoUrl?:string;
  @Input() backgroundUrl?:string; 
  @Input() videoUrl?: string; 
  @Input() disableAPI:boolean = false;

  currencySwitchTimer:number = 6000;
  videoSwitchTimer:number = 8000;

  // Control flags: 1 is "on", 0 is "off"
  upNextItems: UpNextItem[] = [
    { avatar: '/assets/queue-display/Male_2.png', ticketNumber: 'P-217', personName: 'Kristin Watson' },
    { avatar: '/assets/queue-display/Male_1.png', ticketNumber: 'P-218', personName: 'Al Francis Salceda' },
    { avatar: '/assets/queue-display/Female_2.png', ticketNumber: 'R-247', personName: 'Joey Bichara' },
    { avatar: '/assets/queue-display/female_1.png', ticketNumber: 'R-217', personName: 'Kenneth Felix Belga' },
  ];

  weatherItems: WeatherItem[] = [
    { time: '12:00 PM', temperature: 40 },
    { time: '2:00 PM', temperature: 20 },
    { time: '4:00 PM', temperature: 30 }
  ];

  currencies: CurrencyInfo[] = [
    { icon:'$', label: 'USD', rate: 0 }, 
    { icon:'¥', label: 'CNY', rate: 0 },
    { icon:'£',label: 'GBP', rate: 0 },
    { icon:'円',label: 'JPY', rate: 0 }
  ];
  currentCurrencyIndex = 0;
  currentCurrency: CurrencyInfo = this.currencies[this.currentCurrencyIndex];
  timeInfo = { location: 'Manila (GMT +8)', time: '' };
  pesoAmount: number = 1; 
  
  // Video-related variables
  showVideo: boolean = false; 
 
  videoCurrentTime: number = 0; 

  constructor(private thirdPartyService: ThirdPartyService, private sanitizer: DomSanitizer) {}

  private isValidYouTubeUrl(url: string): boolean {
    const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(url);
  }
  private getYouTubeVideoId(url: string): string {
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

  safeYoutubeUrl?:SafeResourceUrl;

  getSafeYoutubeUrl(url?:string) {
    if (this.isValidYouTubeUrl(url ??'')) {
      const videoId = this.getYouTubeVideoId(url!);
      const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`;
      this.safeYoutubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else{
      this.safeYoutubeUrl = undefined;
    }
  }

  formatUnixTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };
    return date.toLocaleString('en-US', options);
}


  ngOnInit(): void {
    this.getSafeYoutubeUrl(this.videoUrl);
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
    if(!this.disableAPI){
       // Fetch real-time currency data from CurrencyFreaks
    this.thirdPartyService.getCurrencyData().subscribe({
      next: (data) => {
        console.log(data);
        this.currencies = [
          { icon:'$', label: 'USD', rate: +data.rates.PHP }, 
          { icon:'¥', label: 'CNY', rate: +data.rates.PHP / +data.rates.CNY  },
          { icon:'£',label: 'GBP', rate: +data.rates.PHP / +data.rates.GBP },
          { icon:'円',label: 'JPY', rate: +data.rates.PHP / +data.rates.JPY }
        ];
      },
      error: (error) => {
        console.error('Currency API Error:', error);
        console.log('Detailed Error Response:', error.error);
      }
    });
     this.thirdPartyService.getWeatherData().subscribe({
      next: (data) => {
        let i = 0;
        const now = Math.floor(Date.now() / 1000);
        if(data.forecast.forecastday?.length){
          const hours =  data.forecast.forecastday[0].hour;
          for(let j = 0; j < hours.length; j++){
            if(i == 0){
              if(hours[j].time_epoch < now) continue;
              this.weatherItems[i].time = this.formatUnixTimestamp(hours[j].time_epoch);
              this.weatherItems[i].temperature = hours[j].temp_c
              i++;
              j++;
            }else{
              this.weatherItems[i].time = this.formatUnixTimestamp(hours[j].time_epoch);
              this.weatherItems[i].temperature = hours[j].temp_c;
              i++;
              if(i == 3) break;
              j++;
            }
          }
        }

      },
      error: (error) => {
        console.error('Weather API Error:', error);
        console.log('Detailed Error Response:', error.error);
      }
    });
    }
   

    setInterval(() => {
      // this.toggleVideoUpNextIFrame();
      this.toggleVideoUpNext();
    }, this.videoSwitchTimer); 

        setInterval(() => this.updateCurrency(), this.currencySwitchTimer);
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

  toggleVideoUpNextIFrame(): void {
    this.showVideo = !this.showVideo;
  
    if (this.showVideo) {
      // Show video and resume playback
      if (this.videoPlayer) {
        this.iframePlayer.nativeElement.contentWindow!.postMessage('{"event":"command","func":"seekTo","args":[' + this.videoCurrentTime + ', true]}', '*');
        this.iframePlayer.nativeElement.contentWindow!.postMessage('{"event":"command","func":"playVideo","args":""}', '*'); // Resume playing the video
      }
    } else {
      // Switch to "Up Next" and pause the video
      if (this.videoPlayer) {
        this.iframePlayer.nativeElement.contentWindow!.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*'); // Pause the video
        this.iframePlayer.nativeElement.contentWindow!.postMessage('{"event":"command","func":"getCurrentTime","args":""}', '*'); // Get current time and store it
        // You might need to implement a way to handle the response to store `videoCurrentTime`
      }
    }
  }


}




