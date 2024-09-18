// a-contentmgmt.component.ts
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentModComponent } from './content-mod/content-mod.component';

@Component({
  selector: 'app-a-contentmgmt',
  standalone: true,
  imports: [ContentModComponent, CommonModule, FormsModule],
  templateUrl: './a-contentmgmt.component.html',
  styleUrls: ['./a-contentmgmt.component.css']
})
export class AContentmgmtComponent {
  @ViewChild(ContentModComponent) contentModComponent!: ContentModComponent;

  showModal: boolean = false;
  announcementText: string = '';
  notesText: string = '';
  backgroundType: 'photo' | 'color' = 'photo';
  backgroundColor: string = '#FFFFFF';
  selectedFiles: { [key: string]: File | null } = {
    Logo: null,
    'Background Photo': null,
    Video: null,
  };
  youtubeUrl: string = '';
  videoOption: 'upload' | 'url' = 'upload';
  maxCharCount: number = 200;
  logoUrl: string = 'path/to/default/logo.png';

  private updateContentMod(): void {
    if (this.contentModComponent) {
      this.contentModComponent.updateContent({
        logoUrl: this.logoUrl,
        backgroundType: this.backgroundType,
        backgroundColor: this.backgroundColor,
        backgroundPhotoUrl: this.selectedFiles['Background Photo'] ? URL.createObjectURL(this.selectedFiles['Background Photo']) : null,
        videoUrl: this.videoOption === 'url' ? this.youtubeUrl : (this.selectedFiles['Video'] ? URL.createObjectURL(this.selectedFiles['Video']) : null),
        announcementText: this.announcementText,
        notesText: this.notesText
      });
    }
  }

  onFileUpload(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFiles[type] = input.files[0];
      console.log(`${type} uploaded:`, input.files[0].name);

      if (type === 'Logo') {
        this.updateLogoUrl(input.files[0]);
      }
    }
    this.updateContentMod();
  }

  private updateLogoUrl(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.logoUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  addWidget(widgetType: string): void {
    console.log(`${widgetType} added`);
    this.updateContentMod();
  }

  onAnnouncementChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.announcementText = textarea.value.slice(0, this.maxCharCount);
    this.updateContentMod();
  }

  onNotesChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.notesText = textarea.value.slice(0, this.maxCharCount);
    this.updateContentMod();
  }

  onBackgroundTypeChange(type: 'photo' | 'color'): void {
    this.backgroundType = type;
    if (type === 'photo') {
      this.selectedFiles['Background Photo'] = null;
    }
    this.updateContentMod();
  }

  onBackgroundColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.backgroundColor = input.value;
    this.updateContentMod();
  }

  onYoutubeUrlChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.youtubeUrl = input.value;
    console.log('YouTube URL:', this.youtubeUrl);
    this.updateContentMod();
  }

  onVideoOptionChange(option: 'upload' | 'url'): void {
    this.videoOption = option;
    if (option === 'upload') {
      this.youtubeUrl = '';
    } else {
      this.selectedFiles['Video'] = null;
    }
    this.updateContentMod();
  }

  getFileName(fileType: string): string {
    return this.selectedFiles[fileType]?.name || 'No file chosen';
  }

  isFilePicked(fileType: string): boolean {
    return !!this.selectedFiles[fileType];
  }

  getRemainingChars(text: string): number {
    return this.maxCharCount - text.length;
  }

  closePreviewModal(): void {
    this.showModal = false;
  }

  openPreviewModal(): void {
    this.showModal = true;
  }

  saveChanges(): void {
    console.log('Saving changes...');
    console.log('Announcement Text:', this.announcementText);
    console.log('Notes Text:', this.notesText);
    console.log('Selected Files:', this.selectedFiles);
    console.log('Background Type:', this.backgroundType);

    if (this.backgroundType === 'color') {
      console.log('Background Color:', this.backgroundColor);
    }

    if (this.videoOption === 'url' && this.youtubeUrl) {
      console.log('YouTube URL:', this.youtubeUrl);
    } else if (this.videoOption === 'upload' && this.selectedFiles['Video']) {
      console.log('Video File:', this.selectedFiles['Video']?.name);
    }

    this.showSuccessMessage('Changes have been saved successfully!');
    this.updateContentMod();
  }

  private showSuccessMessage(message: string): void {
    alert(message);
  }
}