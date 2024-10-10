import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-desk-attendant-layout',
  standalone: true,
  imports: [SidebarComponent,RouterOutlet],
  templateUrl: './desk-attendant-layout.component.html',
  styleUrl: './desk-attendant-layout.component.css'
})
export class DeskAttendantLayoutComponent {
  role = this.route.snapshot.data['requiredRole'];
  constructor(private route: ActivatedRoute){
  }
}
