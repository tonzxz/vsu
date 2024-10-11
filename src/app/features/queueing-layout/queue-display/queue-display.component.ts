import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

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

@Component({
  standalone: true,
  selector: 'app-queue-display',
  imports: [RouterModule, CommonModule],
  templateUrl: './queue-display.component.html',
  styleUrls: ['./queue-display.component.css']
})
export class QueueDisplayComponent implements OnInit, AfterViewInit, OnChanges {
  logoUrl = '/assets/logo/vsu.png';
  backgroundImageUrl = '/assets/queue-display/background.png';

  // Mock data
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
    { avatar: '/assets/queue-display/female_1.png', ticketNumber: 'R-217', personName: 'Kenneth Felix Belga' },
    { avatar: '/assets/queue-display/Male_2.png', ticketNumber: 'P-217', personName: 'Kristin Watson' },
    { avatar: '/assets/queue-display/Male_1.png', ticketNumber: 'P-218', personName: 'Al Francis Salceda' },
    { avatar: '/assets/queue-display/Female_2.png', ticketNumber: 'R-147', personName: 'Joey Bichara' }
  ];

  weatherItems: WeatherItem[] = [
    { time: '12:00 PM', temperature: 40 },
    { time: '2:00 PM', temperature: 38 },
    { time: '4:00 PM', temperature: 30 }
  ];

  currencyInfo = { label: 'USD', value: '₱57.804', change: '+0.1208' };
  timeInfo = { location: 'Manila (GMT +8)', time: '' };

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  ngAfterViewInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  // Function to split the array into chunks of 5 items
  splitArray(array: any[], chunkSize: number): any[][] {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

  // Function to update the time every second
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
}
