import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.css'
})
export class ToggleComponent {
  @Input() isActive: boolean = false;
  @Input() body:string = 'w-12 h-7';
  @Input() knob:string = 'w-5 h-5';
  @Input() translate:string = 'translate-x-5';
  @Output() isActiveChange = new EventEmitter<boolean>();

  onInput() {
    this.isActiveChange.emit(!this.isActive);
  }
}
