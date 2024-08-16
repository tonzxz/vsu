import { Component } from '@angular/core';
import { ADashboardComponent } from "../a-dashboard/a-dashboard.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-a-contentmgmt',
  standalone: true,
  imports: [ADashboardComponent, CommonModule],
  templateUrl: './a-contentmgmt.component.html',
  styleUrl: './a-contentmgmt.component.css'
})
export class AContentmgmtComponent {

}
