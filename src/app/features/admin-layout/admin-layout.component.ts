import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import { HeaderComponent } from '../../shared/header/header.component';
import { UswagonCoreService } from 'uswagon-core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LottieAnimationComponent } from '../../shared/components/lottie-animation/lottie-animation.component';
import { SnackbarComponent } from '../../shared/snackbar/snackbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [SidebarComponent, RouterModule, HeaderComponent, CommonModule,SnackbarComponent, LottieAnimationComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy{
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
