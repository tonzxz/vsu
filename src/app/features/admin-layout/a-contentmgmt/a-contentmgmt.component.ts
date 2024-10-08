// a-contentmgmt.component.ts

import { Component, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentModComponent } from './content-mod/content-mod.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component'; // Ensure correct path
import { Observable, Subscription } from 'rxjs';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';
import { ContentService } from '../../../services/content.service';

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
export class AContentmgmtComponent implements AfterViewInit, OnDestroy, OnInit {
  // ViewChild to access ContentModComponent
  @ViewChild(ContentModComponent) contentModComponent!: ContentModComponent;

  // ViewChild to access Content Settings section for scrolling
  @ViewChild('contentSettings') contentSettings!: ElementRef;

  // Track selected tab
  selectedTab: string = 'Registrar';

  // Control the visibility of Content Settings
  isContentSettingsOpen: boolean = false;

  // Toggle States for Sections
  isMediaUploadsOpen: boolean = false;
  isColorSettingsOpen: boolean = false;
  isContentOpen: boolean = false;
  isWidgetsOpen: boolean = false;

  // Content Settings Form Fields
  announcementText: string = '';
  notesText: string = '';
  backgroundType: 'photo' | 'color' = 'photo';
  backgroundColor: string = '#283c1c';
  selectedFiles: { [key: string]: File | null } = {
    logo: null,
    background: null,
    video: null,
  };
  youtubeUrl: string = '';
  videoOption: 'upload' | 'url' = 'upload';
  maxCharCount: number = 200;
  logoUrl: string = 'assets/logo/vsu.png';

  // New Color Settings
  // textColor: string = '#000000';
  // widgetsBackgroundColor: string = '#ffffff';
  // processingContainerColor: string = '#ffffff';
  // processingTextColor: string = '#000000';
  
  public colors:{[key:string]:string} = {
    'primary_text':'#000000',
    'secondary_text':'#000000',
    'tertiary_text':'#000000',
    'primary_bg': '#ffffff',
    'secondary_bg': '#ffffff',
    'tertiary_bg': '#ffffff',
  }

  colorTitle:{[key:string]:string} = {
    'primary_text':'Primary Text Color',
    'secondary_text':'Secondary Text Color',
    'tertiary_text':'Tertiary Text Color',
    'primary_bg': 'Primary Background Color',
    'secondary_bg': 'Secondary Background Color',
    'tertiary_bg': 'Tertiary Background Color',
  }


  colorKeys = Object.keys(this.colors);

  // Widgets state
  public widgets = {
    weather: false,
    time: false,
    currency: false,
  };

  // Preview URLs for uploaded images/videos
  previewUrls: { [key: string]: string | null } = {
    logo: null,
    background: null,
    video: null,
  };

  // Default content for each tab
  contentData: { [key: string]: any } = {
    registrar: {
      title:'Registrar Division',
      logoUrl: 'assets/logo/vsu.png',
      backgroundType: 'photo',
      backgroundColor: '#283c1c',
      backgroundPhotoUrl: null,
      videoUrl: null,
      announcementText: 'Registrar Announcements',
      notesText: 'Registrar Notes',
      widgets: {
        weather: false,
        time: false,
        currency: false,
      },
      colors: this.colors
    },
    cashier: {
      title:'Cash Division',
      logoUrl: 'assets/logo/vsu.png',
      backgroundType: 'color',
      backgroundColor: '#283c1c',
      backgroundPhotoUrl: null,
      videoUrl: null,
      announcementText: 'Cash Division Announcements',
      notesText: 'Cash Division Notes',
      widgets: {
        weather: false,
        time: false,
        currency: false,
      },
      colors: this.colors
    },
    accountant: {
      title:'Accounting Division',
      logoUrl: 'assets/logo/vsu.png',
      backgroundType: 'photo',
      backgroundColor: '#283c1c',
      backgroundPhotoUrl: null,
      videoUrl: null,
      announcementText: 'Accounting Office Announcements',
      notesText: 'Accounting Office Notes',
      widgets: {
        weather: false,
        time: false,
        currency: false,
      },
      colors: this.colors
    },
  };

  // Store the default content data to enable reset functionality
  private defaultContentData: { [key: string]: any };

  isSuperAdmin:boolean = false;
  // Track if there are unsaved changes
  isDirty: boolean = false;

  divisions:{id:string, name:string}[] =[];

  contents:any[] =[];

  // Subscription for dialog
  private dialogSubscription!: Subscription;

  constructor(
    private snackBar: MatSnackBar, 
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private auth: UswagonAuthService,
    private API:UswagonCoreService,
    private contentService: ContentService
  ) {
    // Deep clone the initial contentData to defaultContentData
    this.defaultContentData = JSON.parse(JSON.stringify(this.contentData));
    this.isSuperAdmin = this.auth.accountLoggedIn() == 'superadmin';
    if(!this.isSuperAdmin){
      this.selectedTab = this.auth.accountLoggedIn()!;
    }else{
      this.selectedTab = 'registrar';
    }
    
  }

  ngOnInit(): void {
    this.loadSettings();
  }



  async loadSettings(){
    const user = this.auth.getUser();
    this.API.setLoading(true);
    try{
      if(user.role == 'superadmin'){
        const divisions = await this.contentService.getDivisions();
        this.divisions = divisions.reduce((prev:any,curr:any)=>{
          if(curr.id != user.division_id){
            return [...prev, { id:curr.id, name:curr.name}] 
          } else{
            return prev;
          }
        },[]);
        
        this.contents = await this.contentService.getContentSettings();
        const content = this.contents.find((content)=>{
          return content.id == this.divisions[0].id
        })
        if(content == undefined ){
          return;
        }
        this.colors = {
          'primary_text':content.primary_text,
          'secondary_text':content.secondary_text,
          'tertiary_text':content.tertiary_text,
          'primary_bg': content.primary_bg,
          'secondary_bg': content.secondary_bg,
          'tertiary_bg': content.tertiary_bg,
        }

        this.widgets = { 
          weather: content.weather == 't',
          time: content.time == 't',
          currency: content.currency == 't',
         }

        this.contentData[this.selectedTab] = {
          title: this.divisions[0].name,
          logoUrl: this.previewUrls['logo'] || content.logo,
          backgroundType: content.background != null ? 'photo':'color',
          backgroundColor: this.colors['primary_bg'],
          backgroundPhotoUrl: this.previewUrls['background'] || content.background,
          videoUrl:
            content.video,
          announcementText: this.announcementText,
          notesText: this.notesText,
          widgets: { 
           ...this.widgets
           },
          colors: {...this.colors}
        };        
        
      }else{
        const content = await this.contentService.getContentSetting();
  
        if(content == null){
          return;
        }

        this.colors = {
          'primary_text':content.primary_text,
          'secondary_text':content.secondary_text,
          'tertiary_text':content.tertiary_text,
          'primary_bg': content.primary_bg,
          'secondary_bg': content.secondary_bg,
          'tertiary_bg': content.tertiary_bg,
        }

        this.widgets = { 
          weather: content.weather == 't',
          time: content.time == 't',
          currency: content.currency == 't',
         }
        
         console.log(this.colors)

        this.contentData[this.selectedTab] = {
          title:  this.contentData[this.selectedTab].title,
          logoUrl: this.previewUrls['logo'] || content.logo,
          backgroundType: content.background != null ? 'photo':'color',
          backgroundColor: this.colors['primary_bg'],
          backgroundPhotoUrl: this.previewUrls['background'] || content.background,
          videoUrl:
            content.video,
          announcementText: this.announcementText,
          notesText: this.notesText,
          widgets: { 
            ...this.widgets
           },
          colors: {
            ...this.colors
          }
        };  
      }
      this.API.setLoading(false);
    }catch(e:any){
      this.API.setLoading(false);
      throw new Error(e.message);
    }
  }

  

  ngAfterViewInit(): void {
    // Initialize the ContentModComponent with the default tab's data
    this.updateContentMod();

  }

  ngOnDestroy(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }

  /**
   * Handle tab click with smooth transition
   * @param tab - The name of the tab clicked
   */

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
    this.youtubeUrl = tabData.videoUrl || ''; // Reset YouTube URL or load tab's video URL
    this.videoOption = tabData.videoUrl ? 'url' : 'upload';
    this.announcementText = tabData.announcementText;
    this.notesText = tabData.notesText;
    this.widgets = { ...tabData.widgets }; // Copy widgets state

    // Update new color settings
    // this.textColor = tabData.textColor;
    // this.widgetsBackgroundColor = tabData.widgetsBackgroundColor;
    // this.processingContainerColor = tabData.processingContainerColor;
    // this.processingTextColor = tabData.processingTextColor;
    this.colors = tabData.colors;

    // Load existing preview URLs from contentData
    this.previewUrls['logo'] = tabData.logoUrl;
    this.previewUrls['background'] = tabData.backgroundPhotoUrl;
    this.previewUrls['video'] = tabData.videoUrl;

    // Reset file inputs
    this.selectedFiles['video'] = null;
    this.selectedFiles['logo'] = null;
    this.selectedFiles['background'] = null;

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
        logoUrl: this.previewUrls['logo'] || this.logoUrl,
        backgroundType: this.backgroundType,
        backgroundColor: this.backgroundColor,
        backgroundPhotoUrl: this.previewUrls['background'],
        videoUrl: this.previewUrls['video'],
        announcementText: this.announcementText,
        notesText: this.notesText,
        tabName: this.contentData[this.selectedTab].title,
        colors: this.colors,
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
      if (type === 'logo' || type === 'background') {
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
          this.snackBar.open(`Invalid file type. Only JPG and PNG are allowed for ${type}.`, 'Close', {
            duration: 3000,
          });
          this.selectedFiles[type] = null;
          this.previewUrls[type] = null;
          return;
        }
      }

      if (type === 'video') {
        const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        if (!validTypes.includes(file.type)) {
          this.snackBar.open('Invalid file type for Video. Allowed types: MP4, WEBM, OGG.', 'Close', {
            duration: 3000,
          });
          this.selectedFiles['video'] = null;
          this.previewUrls['video'] = null;
          return;
        }
      }

      this.selectedFiles[type] = file;
      console.log(`${type} uploaded:`, file.name);

      // Generate preview URL using FileReader
      this.generatePreviewUrl(file, type);

      this.isDirty = true; // Mark as dirty
      this.updateContentMod();
    }
  }

  /**
   * Generate a data URL for previewing uploaded files
   * @param file - The uploaded file
   * @param type - The type of file (Logo, Background Photo, Video)
   */
  private generatePreviewUrl(file: File, type: string): void {
    if (type === 'video') {
      // For videos, use the object URL
      this.previewUrls[type] = URL.createObjectURL(file);
      this.updateContentMod();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrls[type] = reader.result as string;
      this.updateContentMod();
    };
    reader.readAsDataURL(file);
  }

  /**
   * Remove an uploaded file and its preview
   * @param type - The type of file to remove (Logo, Background Photo, Video)
   */
  removeFile(type: string): void {
    this.selectedFiles[type] = null;
    this.previewUrls[type] = null;

    // Update the ContentModComponent
    this.updateContentMod();

    // Mark as dirty
    this.isDirty = true;

    // Notify user
    this.snackBar.open(`${type} has been removed.`, 'Close', {
      duration: 2000,
    });
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
      this.selectedFiles['background'] = null;
      this.previewUrls['background'] = null;
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
      this.previewUrls['video'] = null;
      this.updateContentMod();
      return;
    }

    if (!this.isValidYouTubeUrl(url)) {
      this.snackBar.open('Invalid YouTube URL.', 'Close', {
        duration: 3000,
      });
      this.youtubeUrl = '';
      this.previewUrls['video'] = null;
      this.updateContentMod();
      return;
    }

    // Generate embed URL or handle as needed
    this.previewUrls['video'] = this.youtubeUrl;
    this.updateContentMod();
    this.isDirty = true; // Mark as dirty
  }

  /**
   * Handle changes in video option selection
   * @param option - The selected video option ('upload' or 'url')
   */
  onVideoOptionChange(option: 'upload' | 'url'): void {
    this.videoOption = option;
    if (option === 'upload') {
      this.youtubeUrl = '';
      this.previewUrls['video'] = null;
    } else {
      this.selectedFiles['video'] = null;
      this.previewUrls['video'] = null;
    }
    this.isDirty = true; // Mark as dirty
    this.updateContentMod();
  }

  /**
   * Get the name of the selected file for a given type
   * @param fileType - The type of file ('logo', 'background', 'video')
   * @returns The name of the selected file or 'No file chosen'
   */
  getFileName(fileType: string): string {
    return this.selectedFiles[fileType]?.name || 'No file chosen';
  }

  /**
   * Check if a file has been picked for a given type
   * @param fileType - The type of file ('logo', 'background', 'video')
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
      this.openConfirmationDialog('You have unsaved changes. Do you want to save them before closing?').subscribe((result) => {
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
   * Handle changes in Text Color Picker
   * @param event - The input event
   */
  onColorChange(key:string,event: Event): void {
    const input = event.target as HTMLInputElement;
    this.colors[key] = input.value;
    this.isDirty = true; // Mark as dirty
    this.updateContentMod();
  }


  /**
   * Save changes made in the Content Settings
   */
  async saveChanges() {
  
    await this.contentService.updateContentSettings(
      {
        selectedFiles:this.selectedFiles,
        colors: this.colors,
        widgets: this.widgets,
        videoOption:this.videoOption,
        videoUrl: this.youtubeUrl
      }
    )

    // Update the contentData for the current tab
    this.contentData[this.selectedTab] = {
      title: this.contentData[this.selectedTab].title,
      logoUrl: this.previewUrls['logo'] || this.contentData[this.selectedTab].logoUrl,
      backgroundType: this.backgroundType,
      backgroundColor: this.backgroundColor,
      backgroundPhotoUrl: this.previewUrls['background'],
      videoUrl:
        this.videoOption === 'url'
          ? this.youtubeUrl
          : this.selectedFiles['video']
          ? this.previewUrls['video']
          : null,
      announcementText: this.announcementText,
      notesText: this.notesText,
      widgets: { ...this.widgets }, // Save the widgets state
      colors: {...this.colors}
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
    this.youtubeUrl = tabData.videoUrl || ''; // Reset YouTube URL or load tab's video URL
    this.videoOption = tabData.videoUrl ? 'url' : 'upload';
    this.announcementText = tabData.announcementText;
    this.notesText = tabData.notesText;
    this.widgets = { ...tabData.widgets }; // Copy widgets state

    // Update new color settings
    this.colors = tabData.colors;


    // Load existing preview URLs from contentData
    this.previewUrls['logo'] = tabData.logoUrl;
    this.previewUrls['background'] = tabData.backgroundPhotoUrl;
    this.previewUrls['video'] = tabData.videoUrl;

    // Reset file inputs
    this.selectedFiles['video'] = null;
    this.selectedFiles['logo'] = null;
    this.selectedFiles['background'] = null;

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
   * @param message - The confirmation message to display
   */
  private openConfirmationDialog(message: string): Observable<'save' | 'discard'> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Changes',
        message: message,
      },
    });

    return dialogRef.afterClosed();
  }

  /**
   * Reset the current tab's content to its default layout
   */
  resetToDefault(): void {
    this.openConfirmationDialog('Are you sure you want to reset the layout to its default settings? This action cannot be undone.').subscribe((result) => {
      if (result === 'save') {
        this.saveChanges();
        this.performReset();
      } else if (result === 'discard') {
        this.performReset();
      }
      // If 'cancel', do nothing
    });
  }

  /**
   * Perform the actual reset to default
   */
  private performReset(): void {
    const defaultData = this.defaultContentData[this.selectedTab];
    this.contentData[this.selectedTab] = JSON.parse(JSON.stringify(defaultData));

    // Update all form fields based on the default data
    this.logoUrl = defaultData.logoUrl;
    this.backgroundType = defaultData.backgroundType;
    this.backgroundColor = defaultData.backgroundColor;
    this.youtubeUrl = defaultData.videoUrl || '';
    this.videoOption = defaultData.videoUrl ? 'url' : 'upload';
    this.announcementText = defaultData.announcementText;
    this.notesText = defaultData.notesText;
    this.widgets = { ...defaultData.widgets };

    // Update new color settings
    this.colors = defaultData.colors;

    // Load existing preview URLs from contentData
    this.previewUrls['logo'] = defaultData.logoUrl;
    this.previewUrls['background'] = defaultData.backgroundPhotoUrl;
    this.previewUrls['video'] = defaultData.videoUrl;

    // Reset file inputs
    this.selectedFiles['video'] = null;
    this.selectedFiles['logo'] = null;
    this.selectedFiles['background'] = null;

    // Update content on ContentModComponent
    this.updateContentMod();

    // Reset isDirty
    this.isDirty = false;

    // Notify user
    this.showSuccessMessage('Layout has been reset to default settings.');
  }

  onTabClick(tab:string){
    this.selectedTab = tab;
  }

  /**
   * Handle the Reset to Default Layout button click
   */
  onResetToDefaultClick(): void {
    if (this.isDirty) {
      this.openConfirmationDialog('Resetting to default settings will discard all unsaved changes. Do you want to save your changes before proceeding?').subscribe((result) => {
        if (result === 'save') {
          this.saveChanges();
          this.resetToDefault();
        } else if (result === 'discard') {
          this.resetToDefault();
        }
        // If 'cancel', do nothing
      });
    } else {
      this.resetToDefault();
    }
  }

  /**
   * Toggle individual sections in Content Settings
   * @param section - The section to toggle ('mediaUploads', 'colorSettings', 'content', 'widgets')
   */
  toggleSection(section: string): void {
    switch (section) {
      case 'mediaUploads':
        this.isMediaUploadsOpen = !this.isMediaUploadsOpen;
        break;
      case 'colorSettings':
        this.isColorSettingsOpen = !this.isColorSettingsOpen;
        break;
      case 'content':
        this.isContentOpen = !this.isContentOpen;
        break;
      case 'widgets':
        this.isWidgetsOpen = !this.isWidgetsOpen;
        break;
    }
  }
}
