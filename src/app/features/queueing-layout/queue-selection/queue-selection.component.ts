import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-queue-selection',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './queue-selection.component.html',
  styleUrls: ['./queue-selection.component.css'],
})
export class QueueSelectionComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  selected = false;

  onRoleSelect(role: string): void {

    this.router.navigate(['display', role], { relativeTo: this.route });
    this.selected = true;
  }
}
