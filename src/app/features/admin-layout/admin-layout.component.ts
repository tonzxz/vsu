import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import { HeaderComponent } from '../../shared/header/header.component';
import { UswagonCoreService } from 'uswagon-core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [SidebarComponent, RouterModule, HeaderComponent, CommonModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy{
  constructor(private route: ActivatedRoute, private API:UswagonCoreService){}
  role = this.route.snapshot.data['requiredRole'];
  isLoading:boolean= false;
  loading$?:Subscription;
  ngOnInit(): void {
     this.loading$ = this.API.isLoading$.subscribe(loading=>{
      this.isLoading=loading;
    })
  }

  ngOnDestroy(): void {
    this.loading$!.unsubscribe();
  }

}
