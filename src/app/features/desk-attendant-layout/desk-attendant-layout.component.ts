import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { LottieAnimationComponent } from '../../shared/components/lottie-animation/lottie-animation.component';
import { CommonModule } from '@angular/common';
import { UswagonCoreService } from 'uswagon-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-desk-attendant-layout',
  standalone: true,
  imports: [SidebarComponent,RouterOutlet,HeaderComponent, LottieAnimationComponent,CommonModule],
  templateUrl: './desk-attendant-layout.component.html',
  styleUrl: './desk-attendant-layout.component.css'
})
export class DeskAttendantLayoutComponent {
  constructor(private route: ActivatedRoute, private API:UswagonCoreService,private cdr: ChangeDetectorRef){}
  role = this.route.snapshot.data['requiredRole'];
  isLoading:boolean= false;
  loading$?:Subscription;
  ngOnInit(): void {
     this.loading$ = this.API.isLoading$.subscribe(loading=>{
      this.isLoading=loading;
      this.cdr.detectChanges();
    })
  }

  showUploadProgress(){
    return this.API.uploadProgress;
  }

  ngOnDestroy(): void {
    this.loading$!.unsubscribe();
  }

}
