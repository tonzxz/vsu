import { Component, Input } from '@angular/core';
import { LottieAnimationComponent } from '../components/lottie-animation/lottie-animation.component';
import { CommonModule } from '@angular/common';
import { UswagonCoreService } from 'uswagon-core';

interface Feedback{
  type:'success'|'warning'|'error'|'neutral' ;
  message:string;
  timeout?:any;
}

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [LottieAnimationComponent,CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent {
  @Input() fe: 'success'|'warning'|'error'|'neutral' = 'success';


  constructor(private API:UswagonCoreService){}

  borderColorMap={
    success: 'border-green-600/40',
    warning:'border-yellow-600/40',
    error:'border-red-600/40',
    neutral: 'border-gray-600/40',
  }
  bgColorMap={
    success: 'bg-green-600',
    warning:'bg-yellow-600',
    error:'bg-red-600',
    neutral: 'bg-black',
  }
  lottieMap={
    success: 'check',
    warning:'yellowWarning',
    error:'warning',
    neutral: 'confirmation'
  }

  getFeedbacks(){
   return this.API.getFeedbacks();
  }

  close(index:number){
    this.API.closeFeedback(index);
  }

}
