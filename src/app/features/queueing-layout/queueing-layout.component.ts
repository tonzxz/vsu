import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { QueueDisplayComponent } from './queue-display/queue-display.component';
import { ContentService } from '../../services/content.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { UswagonCoreService } from 'uswagon-core';
import { LottieAnimationComponent } from '../../shared/components/lottie-animation/lottie-animation.component';
import { QueueService } from '../../services/queue.service';
import { ActivatedRoute } from '@angular/router';

interface Division{
  id:string;
  name:string;
}

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
  contentIndex: number = 0;
  divisions:Division[]=[];
  selectedDivision?:string;

  ngOnDestroy(): void {
    this.loading$!.unsubscribe();
  }
  constructor(private contentService:ContentService, private API:UswagonCoreService,private cdr: ChangeDetectorRef, private queueServe:QueueService,private route: ActivatedRoute){}
  
  ngOnInit(): void {
    this.loading$ = this.API.isLoading$.subscribe(loading=>{
      this.isLoading=loading;
      this.cdr.detectChanges();
    })

    this.contentIndex = this.route.snapshot.queryParams['reset'];

    if(this.contentIndex!=null){
      this.selectedDivision = undefined;
      localStorage.removeItem('division');
    }
 
    this.loadContents();

    // Listen for updates

    this.API.addSocketListener('content-changes', (data: any) => {  
      if(data.event!='content-changes') return;
      this.loadContents();
    });
  }


  selectDivision(division_id:string){
    this.selectedDivision = division_id;
    this.content = this.contentMap[division_id];
    localStorage.setItem('division', this.selectedDivision);
  }

  contentMap:any={}

  

  async loadContents(){
    this.selectedDivision = localStorage.getItem('division') ?? undefined;

    this.API.setLoading(true);
    this.divisions = await this.contentService.getDivisions();
    const contents = await this.contentService.getContentSettings();

    this.contentMap = contents.reduce((prev:any,item:any)=>{
      return {...prev,...{
        [item.division_id]: item
      }}
    },{})    

    if(this.selectedDivision){
      this.content = this.contentMap[this.selectedDivision];
    }
    this.API.setLoading(false);
  }
}
