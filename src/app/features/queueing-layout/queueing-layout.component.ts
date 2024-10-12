import { Component } from '@angular/core';
import { QueueDisplayComponent } from './queue-display/queue-display.component';

@Component({
  selector: 'app-queueing-layout',
  standalone: true,
  imports: [QueueDisplayComponent],
  templateUrl: './queueing-layout.component.html',
  styleUrl: './queueing-layout.component.css'
})
export class QueueingLayoutComponent {

}
