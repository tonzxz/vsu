import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-kiosk-selection',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './kiosk-selection.component.html',
  styleUrls: ['./kiosk-selection.component.css']
})
export class KioskSelectionComponent {
  showButtons: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Check if a child route is active
        this.showButtons = !this.route.firstChild;
      });
  }

  navigateToForms(department: string): void {
    this.router.navigate(['kiosk-selection', 'forms'], { queryParams: { department } });
  }
}
