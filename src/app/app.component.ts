import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UswagonCoreService } from 'uswagon-core';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'VSUQSM';
  constructor(private API:UswagonCoreService){
    this.API.initialize({
      ...environment,
      loaderDelay: 500,
    })
  }
}
