// a-contentmgmt.component.ts
import { Component, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentModComponent } from './content-mod/content-mod.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component'; // Ensure correct path
import { Observable } from 'rxjs';

@Component({
  selector: 'app-a-contentmgmt',
  standalone: true,
  imports: [
    ContentModComponent, 
    CommonModule, 
    FormsModule, 
    MatSnackBarModule,
    MatDialogModule,
    ConfirmationDialogComponent
  ],
  templateUrl: './a-contentmgmt.component.html',
  styleUrls: ['./a-contentmgmt.component.css'],
})
export class AContentmgmtComponent implements AfterViewInit {
  // ViewChild to access ContentModComponent
  @ViewChild(ContentModComponent) contentModComponent!: ContentModComponent;

  // ViewChild to access Content Settings section for scrolling
  @ViewChild('contentSettings') contentSettings!: ElementRef;

  // Track selected tab
  selectedTab: string = 'Registrar';

  // Control the visibility of Content Settings
  isContentSettingsOpen: boolean = false;

  // Content Settings Form Fields
  announcementText: string = '';
  notesText: string = '';
  backgroundType: 'photo' | 'color' = 'photo';
  backgroundColor: string = '#283c1c';
  selectedFiles: { [key: string]: File | null } = {
    Logo: null,
    'Background Photo': null,
    Video: null,
  };
  youtubeUrl: string = '';
  videoOption: 'upload' | 'url' = 'upload';
  maxCharCount: number = 200;
  logoUrl: string = 'assets/logo/vsu.png';

  // Widgets state
  public widgets = {
    weather: false,
    timeAndDate: false,
    currencyConverter: false,
  };

  // Default content for each tab
  contentData: { [key: string]: any } = {
    Registrar: {
      logoUrl: 'assets/logo/vsu.png',
      backgroundType: 'photo',
      backgroundColor: '#283c1c',
      backgroundPhotoUrl: null,
      videoUrl: null,
      announcementText: 'Registrar Announcements',
      notesText: 'Registrar Notes',
      widgets: {
        weather: false,
        timeAndDate: false,
        currencyConverter: false,
      },
    },
    'Cash Division': {
      logoUrl: 'assets/logo/vsu.png',
      backgroundType: 'color',
      backgroundColor: '#283c1c',
      backgroundPhotoUrl: null,
      videoUrl: null,
      announcementText: 'Cash Division Announcements',
      notesText: 'Cash Division Notes',
      widgets: {
        weather: false,
        timeAndDate: false,
        currencyConverter: false,
      },
    },
    'Accounting Office': {
      logoUrl: 'assets/logo/vsu.png',
      backgroundType: 'photo',
      backgroundColor: '#283c1c',
      backgroundPhotoUrl: null,
      videoUrl: null,
      announcementText: 'Accounting Office Announcements',
      notesText: 'Accounting Office Notes',
      widgets: {
        weather: false,
        timeAndDate: false,
        currencyConverter: false,
      },
    },
  };

  // Track if there are unsaved changes
  isDirty: boolean = false;

  constructor(
    private snackBar: MatSnackBar, 
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    // Initialize the ContentModComponent with the default tab's data
    this.updateContentMod();
  }

  /**
   * Handle tab click with smooth transition
   * @param tab - The name of the tab clicked
   */
  onTabClick(tab: string): void {
    if (this.selectedTab !== tab) {
      if (this.isDirty) {
        this.openConfirmationDialog().subscribe((result) => {
          if (result === 'save') {
            this.saveChanges();
            this.switchTab(tab);
          } else if (result === 'discard') {
            this.discardChanges();
            this.switchTab(tab);
          }
          // If 'cancel', do nothing
        });
      } else {
        this.switchTab(tab);
      }
    }
  }

  /**
   * Switch to the specified tab and update content
   * @param tab - The name of the tab to switch to
   */
  private switchTab(tab: string): void {
    this.selectedTab = tab;
    const tabData = this.contentData[tab];
    // Update all the properties based on the selected tab
    this.logoUrl = tabData.logoUrl;
    this.backgroundType = tabData.backgroundType;
    this.backgroundColor = tabData.backgroundColor;
    this.selectedFiles['Background Photo'] = null; // Reset background photo
    this.youtubeUrl = tabData.videoUrl || ''; // Reset YouTube URL or load tab's video URL
    this.videoOption = tabData.videoUrl ? 'url' : 'upload';
    this.announcementText = tabData.announcementText;
    this.notesText = tabData.notesText;
    this.widgets = { ...tabData.widgets }; // Copy widgets state

    // Reset file inputs (if necessary)
    this.selectedFiles['Video'] = null;
    this.selectedFiles['Logo'] = null;

    // Update content on ContentModComponent
    this.updateContentMod();

    // Close Content Settings if open
    if (this.isContentSettingsOpen) {
      this.toggleContentSettings();
    }

    // Reset isDirty
    this.isDirty = false;
  }

  /**
   * Update the ContentModComponent with current settings
   */
  private updateContentMod(): void {
    if (this.contentModComponent) {
      this.contentModComponent.updateContent({
        logoUrl: this.logoUrl,
        backgroundType: this.backgroundType,
        backgroundColor: this.backgroundColor,
        backgroundPhotoUrl: this.selectedFiles['Background Photo']
          ? URL.createObjectURL(this.selectedFiles['Background Photo'])
          : null,
        videoUrl:
          this.videoOption === 'url'
            ? this.youtubeUrl
            : this.selectedFiles['Video']
            ? URL.createObjectURL(this.selectedFiles['Video'])
            : null,
        announcementText: this.announcementText,
        notesText: this.notesText,
        tabName: this.selectedTab,
        widgets: this.widgets,
      });
    }
  }

  /**
   * Handle file upload events
   * @param event - The file input change event
   * @param type - The type of file being uploaded (Logo, Background Photo, Video)
   */
  onFileUpload(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file types
      if (type === 'Logo') {
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
          this.snackBar.open('Invalid file type. Only JPG and PNG are allowed for Logo.', 'Close', {
            duration: 3000,
          });
          this.selectedFiles['Logo'] = null;
          return;
        }
      }

      if (type === 'Background Photo') {
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
          this.snackBar.open('Invalid file type. Only JPG and PNG are allowed for Background Photo.', 'Close', {
            duration: 3000,
          });
          this.selectedFiles['Background Photo'] = null;
          return;
        }
      }

      if (type === 'Video') {
        const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        if (!validTypes.includes(file.type)) {
          this.snackBar.open('Invalid file type for Video. Allowed types: MP4, WEBM, OGG.', 'Close', {
            duration: 3000,
          });
          this.selectedFiles['Video'] = null;
          return;
        }
      }

      this.selectedFiles[type] = file;
      console.log(`${type} uploaded:`, file.name);

      if (type === 'Logo') {
        this.updateLogoUrl(file);
      }

      this.isDirty = true; // Mark as dirty
      this.updateContentMod();
    }
  }

  /**
   * Update the logo URL after uploading a new logo
   * @param file - The uploaded logo file
   */
  private updateLogoUrl(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.logoUrl = e.target?.result as string;
      this.updateContentMod(); // Ensure the content is updated with the new logo
      this.isDirty = true; // Mark as dirty
    };
    reader.readAsDataURL(file);
  }

  /**
   * Handle changes in the announcement textarea
   * @param event - The input event
   */
  onAnnouncementChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    if (textarea.value.length > this.maxCharCount) {
      this.snackBar.open('Announcement text cannot exceed 200 characters.', 'Close', {
        duration: 3000,
      });
      this.announcementText = textarea.value.slice(0, this.maxCharCount);
    } else {
      this.announcementText = textarea.value;
    }
    this.isDirty = true; // Mark as dirty
    this.updateContentMod();
  }

  /**
   * Handle changes in the notes textarea
   * @param event - The input event
   */
  onNotesChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    if (textarea.value.length > this.maxCharCount) {
      this.snackBar.open('Notes text cannot exceed 200 characters.', 'Close', {
        duration: 3000,
      });
      this.notesText = textarea.value.slice(0, this.maxCharCount);
    } else {
      this.notesText = textarea.value;
    }
    this.isDirty = true; // Mark as dirty
    this.updateContentMod();
  }

  /**
   * Handle changes in background type selection
   * @param type - The selected background type ('photo' or 'color')
   */
  onBackgroundTypeChange(type: 'photo' | 'color'): void {
    this.backgroundType = type;
    if (type === 'color') {
      this.selectedFiles['Background Photo'] = null;
      // Optionally reset backgroundColor if not needed
    }
    this.isDirty = true; // Mark as dirty
    this.updateContentMod();
  }

  /**
   * Handle changes in background color picker
   * @param event - The input event
   */
  onBackgroundColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.backgroundColor = input.value;
    this.isDirty = true; // Mark as dirty
    this.updateContentMod();
  }

  /**
   * Handle changes in YouTube URL input
   * @param event - The input event
   */
  onYoutubeUrlChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const url = input.value.trim();
    this.youtubeUrl = url;

    if (url === '') {
      this.updateContentMod();
      return;
    }

    if (!this.isValidYouTubeUrl(url)) {
      this.snackBar.open('Invalid YouTube URL.', 'Close', {
        duration: 3000,
      });
      this.youtubeUrl = '';
    }

    this.isDirty = true; // Mark as dirty
    this.updateContentMod();
  }

  /**
   * Handle changes in video option selection
   * @param option - The selected video option ('upload' or 'url')
   */
  onVideoOptionChange(option: 'upload' | 'url'): void {
    this.videoOption = option;
    if (option === 'upload') {
      this.youtubeUrl = '';
    } else {
      this.selectedFiles['Video'] = null;
    }
    this.isDirty = true; // Mark as dirty
    this.updateContentMod();
  }

  /**
   * Get the name of the selected file for a given type
   * @param fileType - The type of file ('Logo', 'Background Photo', 'Video')
   * @returns The name of the selected file or 'No file chosen'
   */
  getFileName(fileType: string): string {
    return this.selectedFiles[fileType]?.name || 'No file chosen';
  }

  /**
   * Check if a file has been picked for a given type
   * @param fileType - The type of file ('Logo', 'Background Photo', 'Video')
   * @returns True if a file is picked, else False
   */
  isFilePicked(fileType: string): boolean {
    return !!this.selectedFiles[fileType];
  }

  /**
   * Get the remaining character count for a text field
   * @param text - The current text
   * @returns The number of remaining characters
   */
  getRemainingChars(text: string): number {
    return this.maxCharCount - text.length;
  }

  /**
   * Toggle the visibility of the Content Settings section
   */
  toggleContentSettings(): void {
    if (this.isContentSettingsOpen && this.isDirty) {
      // User is trying to close while there are unsaved changes
      this.openConfirmationDialog().subscribe((result) => {
        if (result === 'save') {
          this.saveChanges();
        } else if (result === 'discard') {
          this.discardChanges();
          this.isContentSettingsOpen = false;
        }
        // If 'cancel', do not close
      });
    } else {
      this.isContentSettingsOpen = !this.isContentSettingsOpen;
    }
  }

  /**
   * Handle widget state changes
   */
  onWidgetChange(): void {
    console.log('Widgets updated:', this.widgets);
    this.isDirty = true; // Mark as dirty
    this.updateContentMod();
  }

  /**
   * Save changes made in the Content Settings
   */
  saveChanges(): void {
    console.log('Saving changes...');
    console.log('Selected Tab:', this.selectedTab);
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

    console.log('Widgets:', this.widgets);

    // Update the contentData for the current tab
    this.contentData[this.selectedTab] = {
      logoUrl: this.logoUrl,
      backgroundType: this.backgroundType,
      backgroundColor: this.backgroundColor,
      backgroundPhotoUrl: this.selectedFiles['Background Photo']
        ? URL.createObjectURL(this.selectedFiles['Background Photo'])
        : null,
      videoUrl:
        this.videoOption === 'url'
          ? this.youtubeUrl
          : this.selectedFiles['Video']
          ? URL.createObjectURL(this.selectedFiles['Video'])
          : null,
      announcementText: this.announcementText,
      notesText: this.notesText,
      widgets: { ...this.widgets }, // Save the widgets state
    };

    this.showSuccessMessage('Changes have been saved successfully!');
    this.updateContentMod();

    // Reset isDirty before toggling settings to prevent the dialog from appearing
    this.isDirty = false;

    this.toggleContentSettings(); // Close Content Settings after saving

    // No need to reset isDirty here as it's already set to false
  }

  /**
   * Discard changes and revert to the last saved state
   */
  discardChanges(): void {
    console.log('Discarding changes...');
    const tabData = this.contentData[this.selectedTab];
    this.logoUrl = tabData.logoUrl;
    this.backgroundType = tabData.backgroundType;
    this.backgroundColor = tabData.backgroundColor;
    this.selectedFiles['Background Photo'] = null; // Reset background photo
    this.youtubeUrl = tabData.videoUrl || ''; // Reset YouTube URL or load tab's video URL
    this.videoOption = tabData.videoUrl ? 'url' : 'upload';
    this.announcementText = tabData.announcementText;
    this.notesText = tabData.notesText;
    this.widgets = { ...tabData.widgets }; // Copy widgets state

    // Reset file inputs (if necessary)
    this.selectedFiles['Video'] = null;
    this.selectedFiles['Logo'] = null;

    // Update content on ContentModComponent
    this.updateContentMod();

    // Reset isDirty
    this.isDirty = false;

    this.showSuccessMessage('Changes have been discarded.');
  }

  /**
   * Display a success message using MatSnackBar
   * @param message - The message to display
   */
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  /**
   * Validate YouTube URL format
   * @param url - The YouTube URL to validate
   * @returns True if valid, else False
   */
  private isValidYouTubeUrl(url: string): boolean {
    const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(url);
  }

  /**
   * Handle Edit Content button click: toggle settings and scroll
   */
  editContent(): void {
    this.toggleContentSettings();

    // Detect changes to ensure the view is updated before scrolling
    this.cdr.detectChanges();

    // Use requestAnimationFrame for better synchronization
    requestAnimationFrame(() => {
      this.scrollToContentSettings();
    });
  }

  /**
   * Scroll to the Content Settings section smoothly
   */
  private scrollToContentSettings(): void {
    if (this.isContentSettingsOpen && this.contentSettings) {
      this.contentSettings.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Open the confirmation dialog and return the user's choice
   */
  private openConfirmationDialog(): Observable<'save' | 'discard' | 'cancel'> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Do you want to save them before proceeding?',
      },
    });

    return dialogRef.afterClosed();
  }
}
