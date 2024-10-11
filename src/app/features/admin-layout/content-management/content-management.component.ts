import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleComponent } from '../../../shared/components/toggle/toggle.component';
import { UswagonAuthService } from 'uswagon-auth';
import { ContentService } from '../../../services/content.service';

interface ContentColors {
  primary_bg: string,
  secondary_bg: string,
  tertiary_bg: string,
  primary_text: string,
  secondary_text: string,
  tertiary_text: string,
}

interface ContentCollapsables {
  uploads: boolean,
  widgets:boolean,
  colors:boolean,
  announcements:boolean,
}

interface ContentToggles {
  announcements: boolean,
  videoURL:boolean,
  time: boolean,
  weather: boolean,
  currency: boolean,
}
interface ContentFields {
  announcements:string,
  youtubeURL?:string,
  videoUrl?:string,
  backgroundUrl?:string,
  logoUrl?:string,
}
interface ContentFiles {
  logo?:File,
  background?:File,
  video?:File,
}
interface ContentSettings {
  toggles:ContentToggles,
  colors:ContentColors,
  files: ContentFiles,
  inputFields:ContentFields
}
@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [FormsModule,CommonModule, ToggleComponent],
  templateUrl: './content-management.component.html',
  styleUrl: './content-management.component.css'
})
export class ContentManagementComponent implements OnInit {

  constructor(private auth:UswagonAuthService, private contentService:ContentService){}

  toggles:ContentToggles= {
    announcements:false,
    time:false,
    weather:false,
    currency:false,
    videoURL: false,
  }

  collapsables:ContentCollapsables = {
    uploads:true,
    widgets:false,
    colors:false,
    announcements:false,
  }

  colors:ContentColors={
    primary_bg: '#000000',
    secondary_bg: '#000000',
    tertiary_bg: '#000000',
    primary_text: '#000000',
    secondary_text: '#000000',
    tertiary_text: '#000000',
  }
  
  files:ContentFiles= {}

  inputFields:ContentFields={
    announcements : ''
  }
  

  previousSettings?:ContentSettings;

  contentLoading:boolean = false;
  contents:any[] = [];
  divisions:any[] = [];

  // NG
  ngOnInit(): void {
    this.loadContents();
   
  }

  getLastDirectory(url?:string) {
    if(!url){
      return null;
    }
    // Split the URL by '/' and filter out any empty strings
    const parts = url.split('/').filter(part => part.length > 0);
    // Return the last part
    return parts[parts.length - 1];
  }

  getDivisionNames(){
    return this.divisions.reduce((prev:any,curr:any)=>{
      return [...prev, curr.name]
    },[])
  }

  async loadContents(){
    this.contentLoading = true;
    try{
      if(this.auth.accountLoggedIn() == 'superadmin'){
        this.divisions = await this.contentService.getDivisions();
        this.contents = await this.contentService.getContentSettings();

        const content = this.contents.find((_content)=> _content.division_id == this.divisions[0]);
        if(!content){
          this.previousSettings ={
            toggles: {... this.toggles},
            colors: {...this.colors},
            files: {...this.files},
            inputFields: {...this.inputFields}
          }
          this.contentLoading = false;
          return;
        }
        this.toggles  = {
          announcements: content.announcements != null,
          time: content.time == 't',
          weather:content.weather == 't',
          currency:content.currency == 't',
          videoURL: content.video?.includes('https://'),
        }
        this.colors ={
          primary_bg: content.primary_bg,
          secondary_bg: content.secondary_bg,
          tertiary_bg: content.tertiary_bg,
          primary_text: content.primary_text,
          secondary_text: content.secondary_text,
          tertiary_text: content.tertiary_text
        }
        if(content.logo){
          this.inputFields.logoUrl = content.logo;
        }
        if(content.background){
          this.inputFields.backgroundUrl = content.background;
        }
        if(content.video && !this.toggles.videoURL){
          this.inputFields.videoUrl = content.video;
        }
        if(this.toggles.videoURL){
          this.inputFields.youtubeURL = content.video
        }
        this.contentLoading = false;
      }else{
        const content = await this.contentService.getContentSetting();
        if(!content) {
          this.previousSettings ={
            toggles: {... this.toggles},
            colors: {...this.colors},
            files: {...this.files},
            inputFields: {...this.inputFields}
          }
          this.contentLoading =false;
          return;
        }
        this.toggles  = {
          announcements: content.announcements != null,
          time: content.time == 't',
          weather:content.weather == 't',
          currency:content.currency == 't',
          videoURL: content.video?.includes('https://'),
        }
        this.colors ={
          primary_bg: content.primary_bg,
          secondary_bg: content.secondary_bg,
          tertiary_bg: content.tertiary_bg,
          primary_text: content.primary_text,
          secondary_text: content.secondary_text,
          tertiary_text: content.tertiary_text
        }
        if(content.logo){
          this.inputFields.logoUrl = content.logo;
        }
        if(content.background){
          this.inputFields.backgroundUrl = content.background;
        }
        if(content.video && !this.toggles.videoURL){
          this.inputFields.videoUrl = content.video;
        }
        if(this.toggles.videoURL){
          this.inputFields.youtubeURL = content.video
        }
      }
      this.previousSettings ={
        toggles: {... this.toggles},
        colors: {...this.colors},
        files: {...this.files},
        inputFields: {...this.inputFields}
      }
      this.contentLoading = false;
    }catch(e){
      this.contentLoading = false;
      throw new Error('Something went wrong.');
    }
  }
  
  // UI Functions

  toggleCollapse(key:'uploads'|'widgets'|'colors'|'announcements'){
    if(this.collapsables[key] == true) return;
    this.collapsables[key] = !this.collapsables[key];
    if(this.collapsables[key] == true){
      for(let collasable in this.collapsables){
        if(collasable != key){
          this.collapsables[collasable as keyof typeof this.collapsables] =false; 
        }
      }
    } 
  }

  onFileChange(key:'logo'| 'video'|'background', event: Event){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.files[key] = file;
    }
  }
  revertChanges(){
    this.colors = {...this.previousSettings!.colors};
    this.files = {...this.previousSettings!.files};
    this.inputFields = {...this.previousSettings!.inputFields};
    this.toggles = {...this.previousSettings!.toggles};
  }

  publishChanges(){

  }
}
