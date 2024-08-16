import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-desk-attendant-layout',
  standalone: true,
  imports: [SidebarComponent,RouterOutlet],
  templateUrl: './desk-attendant-layout.component.html',
  styleUrl: './desk-attendant-layout.component.css'
})
export class DeskAttendantLayoutComponent {

}
