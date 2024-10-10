import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './content-management.component.html',
  styleUrl: './content-management.component.css'
})
export class ContentManagementComponent {
  
  toggles:{
    announcements: boolean,
    time: boolean,
    weather: boolean,
    currency: boolean,
  } = {
    announcements:false,
    time:false,
    weather:false,
    currency:false,
  }

  collapsables:{
    uploads: boolean,
    widgets:boolean,
    colors:boolean,
    announcements:boolean,
  } = {
    uploads:true,
    widgets:false,
    colors:false,
    announcements:false,
  }

  colors:{
    primary_bg: string,
    secondary_bg: string,
    tertiary_bg: string,
    primary_text: string,
    secondary_text: string,
    tertiary_text: string,
  }={
    primary_bg: '#000000',
    secondary_bg: '#000000',
    tertiary_bg: '#000000',
    primary_text: '#000000',
    secondary_text: '#000000',
    tertiary_text: '#000000',
  }
  
  files:{
    logo?:File,
    background?:File,
    video?:File,
  } = {}

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
}
