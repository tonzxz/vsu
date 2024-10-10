import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [SidebarComponent, RouterModule, HeaderComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  constructor(private route: ActivatedRoute){}
  role = this.route.snapshot.data['requiredRole'];
}
