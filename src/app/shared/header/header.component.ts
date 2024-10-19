import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  constructor(
    private contentService:ContentService,
    private auth:UswagonAuthService, private API:UswagonCoreService) {}

    divisionLogo?:string;

  ngOnInit(): void {
    this.getDivisionLogo();
  }

  getUserProfile(){
    return this.auth.getUser().profile!=null ? this.API.getFileURL(this.auth.getUser().profile) : 'assets/images/noprofile.png';
  }

  getUserName(){
    return this.auth.getUser().fullname ?? 'Unknown User';
  }
  
  async getDivisionLogo(){
    this.divisionLogo =  (await this.contentService.getContentSetting())?.logo;
    // console.log(division);
  }
}
