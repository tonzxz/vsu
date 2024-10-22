import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import Lottie from 'lottie-web';
import { LottieAnimationComponent } from '../../components/lottie-animation/lottie-animation.component';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, LottieAnimationComponent],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  @Output() onClose = new EventEmitter<void>();
  @Input() title:string = '';
  @Input() description:string='';
  @Input() details?:string;
  @Input() animation:string = '';
  @Input() sound:string = '';

  cancel(){
    this.onClose.emit();
  }
}
