import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DaSidebarComponent } from '../../shared/da-sidebar/da-sidebar.component';

@Component({
  selector: 'app-desk-attendant-layout',
  standalone: true,
  imports: [DaSidebarComponent,RouterOutlet],
  templateUrl: './desk-attendant-layout.component.html',
  styleUrl: './desk-attendant-layout.component.css'
})
export class DeskAttendantLayoutComponent {

}
