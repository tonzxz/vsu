import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { QueueDisplayComponent } from './queue-display/queue-display.component';
import { ContentService } from '../../services/content.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { UswagonCoreService } from 'uswagon-core';
import { LottieAnimationComponent } from '../../shared/components/lottie-animation/lottie-animation.component';
import { QueueService } from '../../services/queue.service';

@Component({
  selector: 'app-queueing-layout',
  standalone: true,
  imports: [QueueDisplayComponent, CommonModule, LottieAnimationComponent],
  templateUrl: './queueing-layout.component.html',
  styleUrl: './queueing-layout.component.css'
})
export class QueueingLayoutComponent implements OnInit,OnDestroy{

  content:any;

  isLoading:boolean= true;
  loading$?:Subscription;

  ngOnDestroy(): void {
    this.loading$!.unsubscribe();
  }
  constructor(private contentService:ContentService, private API:UswagonCoreService,private cdr: ChangeDetectorRef, private queueServe:QueueService){}
  
  ngOnInit(): void {
    this.loading$ = this.API.isLoading$.subscribe(loading=>{
      this.isLoading=loading;
      this.cdr.detectChanges();
    })
 
    this.loadContents();

    // Listen for updates

    this.API.addSocketListener('content-changes', (data: any) => {
      if(data.event!='content-changes') return;
      this.loadContents();
    });
  }

  

  async loadContents(){
    this.API.setLoading(true);
    const contents = await this.contentService.getContentSettings();

    if(contents.length <= 0) {
      this.API.setLoading(false);
      return;
    };
    this.content = contents[0];
    this.API.setLoading(false);
  }
}
