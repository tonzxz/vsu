import { Component } from '@angular/core';
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
  youtubeUrl: string = ''; // For YouTube URL input
  videoOption: 'upload' | 'url' = 'upload'; // Video input method
  maxCharCount: number = 200;

  onFileUpload(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFiles[type] = input.files[0];
      console.log(`${type} uploaded:`, input.files[0].name);
    }
  }

  addWidget(widgetType: string): void {
    console.log(`${widgetType} added`);
    // Implement widget addition logic here
  }

  onAnnouncementChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.announcementText = textarea.value.slice(0, this.maxCharCount);
  }

  onNotesChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.notesText = textarea.value.slice(0, this.maxCharCount);
  }

  onBackgroundTypeChange(type: 'photo' | 'color'): void {
    this.backgroundType = type;
    if (type === 'photo') {
      this.selectedFiles['Background Photo'] = null;
    }
  }

  onBackgroundColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.backgroundColor = input.value;
  }

  onYoutubeUrlChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.youtubeUrl = input.value;
    console.log('YouTube URL:', this.youtubeUrl);
  }

  onVideoOptionChange(option: 'upload' | 'url'): void {
    this.videoOption = option;
    if (option === 'upload') {
      this.youtubeUrl = ''; // Clear YouTube URL when switching to upload
    } else {
      this.selectedFiles['Video'] = null; // Clear video file when switching to URL
    }
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

    // Handle video input type
    if (this.videoOption === 'url' && this.youtubeUrl) {
      console.log('YouTube URL:', this.youtubeUrl);
    } else if (this.videoOption === 'upload' && this.selectedFiles['Video']) {
      console.log('Video File:', this.selectedFiles['Video']?.name);
    }

    // Implement actual save logic here (e.g., API call)

    // Show success message
    this.showSuccessMessage('Changes have been saved successfully!');
  }

  private showSuccessMessage(message: string): void {
    // Implement a more user-friendly success message (e.g., toast notification)
    // For now, we'll use a simple alert
    alert(message);
  }
}
