import { Component } from '@angular/core';
import { ADashboardComponent } from "../../admin-layout/a-dashboard/a-dashboard.component";
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-da-contentmanagement',
  standalone: true,
  imports: [CommonModule, ADashboardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this line
  templateUrl: './da-contentmanagement.component.html',
  styleUrl: './da-contentmanagement.component.css'
})
export class DaContentmanagementComponent {

}
