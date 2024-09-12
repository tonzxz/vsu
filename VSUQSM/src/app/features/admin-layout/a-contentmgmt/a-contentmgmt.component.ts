import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentModComponent } from './content-mod/content-mod.component';

@Component({
  selector: 'app-a-contentmgmt', // Defines the selector for this component
  standalone: true, // Marks the component as standalone
  imports: [ContentModComponent, CommonModule, FormsModule], // Modules imported into this component
  templateUrl: './a-contentmgmt.component.html', // HTML template for the component
  styleUrls: ['./a-contentmgmt.component.css'] // Stylesheet for the component
})
export class AContentmgmtComponent {
  showModal: boolean = false; // Controls the visibility of the modal
  announcementText: string = ''; // Stores the announcement text input
  notesText: string = ''; // Stores the notes text input
  backgroundType: 'photo' | 'color' = 'photo'; // Chooses between a background photo or color
  backgroundColor: string = '#FFFFFF'; // Stores the selected background color
  selectedFiles: { [key: string]: File | null } = {
    Logo: null,
    'Background Photo': null,
    Video: null,
  }; // Holds the selected files for different types (Logo, Background Photo, Video)
  youtubeUrl: string = ''; // Stores the YouTube URL for video input
  videoOption: 'upload' | 'url' = 'upload'; // Chooses between video upload or URL
  maxCharCount: number = 200; // Maximum character count for announcement and notes

  // New property to store the logo URL
  logoUrl: string = 'path/to/default/logo.png'; // Default path for logo image

  // Handles file upload for different file types (Logo, Background Photo, Video)
  onFileUpload(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFiles[type] = input.files[0]; // Store the selected file
      console.log(`${type} uploaded:`, input.files[0].name);

      // If the uploaded file is a logo, update the logo URL
      if (type === 'Logo') {
        this.updateLogoUrl(input.files[0]); // Update the logo URL when a logo is uploaded
      }
    }
  }

  // Updates the logo URL by converting the uploaded file into a data URL
  private updateLogoUrl(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.logoUrl = e.target?.result as string; // Set the logo URL as the file's data URL
    };
    reader.readAsDataURL(file); // Read the uploaded file as a data URL
  }

  // Logs the widget type being added (placeholder for actual logic)
  addWidget(widgetType: string): void {
    console.log(`${widgetType} added`);
  }

  // Handles changes in the announcement text input, ensuring it stays within the character limit
  onAnnouncementChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.announcementText = textarea.value.slice(0, this.maxCharCount); // Limits characters to maxCharCount
  }

  // Handles changes in the notes text input, ensuring it stays within the character limit
  onNotesChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.notesText = textarea.value.slice(0, this.maxCharCount); // Limits characters to maxCharCount
  }

  // Changes the background type between photo and color
  onBackgroundTypeChange(type: 'photo' | 'color'): void {
    this.backgroundType = type;
    if (type === 'photo') {
      this.selectedFiles['Background Photo'] = null; // Clear background photo if switched to color
    }
  }

  // Handles changes in background color
  onBackgroundColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.backgroundColor = input.value; // Update the background color
  }

  // Updates the YouTube URL when provided by the user
  onYoutubeUrlChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.youtubeUrl = input.value;
    console.log('YouTube URL:', this.youtubeUrl); // Log the provided YouTube URL
  }

  // Changes the video option between uploading a file or using a URL
  onVideoOptionChange(option: 'upload' | 'url'): void {
    this.videoOption = option;
    if (option === 'upload') {
      this.youtubeUrl = ''; // Clear YouTube URL when switching to video upload
    } else {
      this.selectedFiles['Video'] = null; // Clear video file when switching to URL
    }
  }

  // Gets the file name for a specific file type
  getFileName(fileType: string): string {
    return this.selectedFiles[fileType]?.name || 'No file chosen'; // Returns the file name or a default message
  }

  // Checks if a file is selected for a specific file type
  isFilePicked(fileType: string): boolean {
    return !!this.selectedFiles[fileType]; // Returns true if a file is selected, otherwise false
  }

  // Gets the remaining characters allowed for the input text (announcement/notes)
  getRemainingChars(text: string): number {
    return this.maxCharCount - text.length; // Returns the remaining character count
  }

  // Closes the preview modal
  closePreviewModal(): void {
    this.showModal = false; // Sets the modal visibility to false
  }

  // Opens the preview modal
  openPreviewModal(): void {
    this.showModal = true; // Sets the modal visibility to true
  }

  // Simulates saving changes, logging the current state of inputs and showing a success message
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

    this.showSuccessMessage('Changes have been saved successfully!'); // Show success message
  }

  // Displays a simple alert with the success message
  private showSuccessMessage(message: string): void {
    alert(message); // Uses a basic alert to show the message (could be replaced with a more user-friendly notification)
  }
}
