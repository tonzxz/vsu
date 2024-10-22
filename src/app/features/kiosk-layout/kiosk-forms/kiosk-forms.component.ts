//kiosk-forms.component.ts
import { Component, model, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import { UswagonCoreService } from 'uswagon-core';
import { QueueService } from '../../../services/queue.service';
import { KioskService } from '../../../services/kiosk.service';
import { DivisionService } from '../../../services/division.service';
import { FeedbackComponent } from '../../../shared/modals/feedback/feedback.component';
import { ServiceService } from '../../../services/service.service';
import { Department, Division, Service } from '../types/kiosk-layout.types';
import { DepartmentService } from '../../../services/department.service';
import { SnackbarComponent } from '../../../shared/snackbar/snackbar.component';
import { LottieAnimationComponent } from '../../../shared/components/lottie-animation/lottie-animation.component';
import { ConfirmationComponent } from '../../../shared/modals/confirmation/confirmation.component';

@Component({
  selector: 'app-kiosk-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, FeedbackComponent,SnackbarComponent,ConfirmationComponent, LottieAnimationComponent],
  templateUrl: './kiosk-forms.component.html',
  styleUrls: ['./kiosk-forms.component.css']
})
export class KioskFormsComponent implements OnInit, OnDestroy {
  [x: string]: any;

  departmentName: string = '';
  currentPeriod: string = 'AM';
  currentTime: Date = new Date();
  currentDate: Date = new Date();
  isChecklistVisible: boolean = false;
  isFormVisible: boolean = false;
  showModal: boolean = false;

  queueNumber: string | null = null;
  selectedServices: Service[] = [];
  selectedType: 'regular' | 'priority' = 'regular';
  customerName: string = '';
  gender: string = '';
  department: string = '';
  studentNumber: string = '';

  services:Service[]= [];
  filteredServiceChecklist:Service[] = [...this.services];
  searchTerm: string = '';
  isDropdownOpen: boolean = false;
  division?:Division;

  departments:Department[] = [];
  serviceInterval:any;
  successDescription = '';
  priorityDetails = `<div class='flex flex-col leading-none py-2 gap-2'>
    Please ensure that you have VALID ID to be considered as priority. <div class="text-sm px-6  text-red-900/85 ">* Without ID desk attendants are ALLOWED to put you at the bottom of queue.</div>
  </div> `;

  isLoading:boolean = false;

  constructor(private route: ActivatedRoute,
    private queueService: QueueService,
    private kioskService: KioskService,
    private divisionService: DivisionService,
    private serviceService:ServiceService,
    private departmentService:DepartmentService,
    private API: UswagonCoreService) {}

 
  modal?:'priority'|'success';

  openFeedback(type:'priority'|'success'){
    this.modal = type;
  }

  closeFeedback(){
    this.modal = undefined;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.filterChecklist(); // Ensure all items are shown when opened
    }
  }


  showServiceNames(){
    return this.selectedServices.map(item=>item.name).join(', ')
  }

  ngOnDestroy(): void {
    if(this.serviceInterval){
      clearInterval(this.serviceInterval)
    }
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.departmentName = params['department'] || 'Department Name';
    });

    if (this.kioskService.kiosk != undefined) {
      this.divisionService.setDivision({
        id: this.kioskService.kiosk.division_id,
        name: this.kioskService.kiosk.division,
      });
      this.division = this.divisionService.selectedDivision;
      this.queueService.getTodayQueues(true);
    } else {
      throw new Error('Invalid method');
    }

    this.services = await this.serviceService.getAllServices(this.divisionService.selectedDivision?.id!);
    this.departments = await this.departmentService.getAllDepartments();
    if(this.serviceInterval){
      clearInterval(this.serviceInterval)
    }
    this.serviceInterval = setInterval(async()=>{
      this.services = await this.serviceService.getAllServices(this.divisionService.selectedDivision?.id!);
      this.departments = await this.departmentService.getAllDepartments();
    },2000)
    this.resetQueueNumberIfNewDay();
  }

  handleButtonClick(type: 'regular' | 'priority'): void {
    this.isChecklistVisible = true;
    this.selectedType = type;
  }

  async toggleSelection(service_id: string) {
    const service = this.services.find(item => item.id === service_id);
    if (service) {

      if (!this.selectedServices.find(item=>item.id == service_id)) {
        this.selectedServices.push(service);
      } else {
        this.selectedServices = this.selectedServices.filter(service => service.id !== service_id);
      }
    }
  }

  filterChecklist() {
    this.filteredServiceChecklist = this.services.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  

  async confirmChecklist() {
    try{
      await this.submitForm();
    }catch(e){
      this.API.sendFeedback('error','Something went wrong.', 5000);
    }
  }

  goBack(): void {
    if (this.isFormVisible) {
      this.isFormVisible = false;
      this.isChecklistVisible = true;
    } else if (this.isChecklistVisible) {
      this.isChecklistVisible = false;
    }
    this.showModal = false;
  }

  closeModal(): void {
    this.showModal = false;
  }

  confirmPriority(){
    this.modal = 'priority';
  }

  async submitForm() {
    if(this.isLoading){
      return;
    }
    if (!this.kioskService.kiosk) {
      throw new Error('Invalid method!');
    }
  this.isLoading = true;

  if(this.selectedServices.length <=0){
    this.API.sendFeedback('error','Please select a service!', 5000);
    this.isLoading =false;
    throw new Error();
  }

  if(this.customerName.trim() == ''){
    this.API.sendFeedback('error','Fullname is required!',5000);
       this.isLoading =false;
    throw new Error();
  }
  if(this.gender.trim() == ''){
    this.API.sendFeedback('error','Gender is required!',5000);
    this.isLoading =false;
    throw new Error();
  }
   try{
    const number = await this.queueService.addToQueue({
      fullname: this.customerName.trim(),
      type: this.selectedType,
      gender: this.gender.toLowerCase() as 'male' | 'female' | 'other',
      services: this.selectedServices.map(item=>item.id!),
      student_id: this.studentNumber.trim() == '' ? undefined : this.studentNumber.trim(),
      department_id: this.department.trim() == '' ? undefined : this.department.trim(),
    });
    this.selectedServices = this.services
    .filter(item => item.selected)
    this.isChecklistVisible = true;
    this.isFormVisible = false;
    this.gender = '';
    this.customerName = '';
    this.studentNumber = '';
    this.successDescription = `Your current position is <span class='font-medium'>${this.selectedType === 'regular' ? 'R' : 'P'}-${number.toString().padStart(3,'0')}</span>`
    await this.printPDF(`${this.selectedType === 'regular' ? 'R' : 'P'}-${number.toString().padStart(3,'0')}`);
    this.isLoading =false;
    this.openFeedback( this.selectedType === 'regular' ? 'success':'priority');
   }catch(e){
    this.isLoading =false;
    this.API.sendFeedback('error','Something went wrong.',5000);
   }


   
  }


  generateQueueNumber(): string {
    const today = new Date().toDateString();
    const queueKey = `${this.departmentName}_${today}`;
    let departmentQueueData = JSON.parse(localStorage.getItem(queueKey) || '{}');

    if (!departmentQueueData.date) {
      departmentQueueData = { date: today, lastRegularQueueNumber: 0, lastPriorityQueueNumber: 0 };
    }

    if (this.selectedType === 'regular') {
      departmentQueueData.lastRegularQueueNumber += 1;
      localStorage.setItem(queueKey, JSON.stringify(departmentQueueData));
      return `R-${departmentQueueData.lastRegularQueueNumber}`;
    } else {
      departmentQueueData.lastPriorityQueueNumber += 1;
      localStorage.setItem(queueKey, JSON.stringify(departmentQueueData));
      return `P-${departmentQueueData.lastPriorityQueueNumber}`;
    }
  }

  resetQueueNumberIfNewDay(): void {
    const today = new Date().toDateString();
    const queueKey = `${this.departmentName}_${today}`;
    let departmentQueueData = JSON.parse(localStorage.getItem(queueKey) || '{}');

    if (departmentQueueData.date !== today) {
      localStorage.setItem(queueKey, JSON.stringify({ date: today, lastRegularQueueNumber: 0, lastPriorityQueueNumber: 0 }));
    }
  }

  async printPDF(code:string): Promise<void> {
    const ticketWidth = 483;  // 483 pixels wide
    const ticketHeight = 371; // 371 pixels tall
    const contentWidth = 80;  // Keep content width as before (in mm)
    const margin = 20; // Add margin in pixels
    const scaleFactor = ticketWidth / contentWidth; // Scale factor to convert mm to pixels

    let yPosition = 0;
    const marginLeft = (ticketWidth - (contentWidth * scaleFactor)) / 2; // Center the content

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [ticketWidth, ticketHeight]
    });

    try {
      // Background Logo
      const logoUrl = './assets/logo/vsu.png';
      const logoData = await this.getBase64Image(logoUrl);
      const transparentLogoData = await this.makeImageTransparent(logoData, 0.1);

      const logoWidth = 300;
      const logoHeight = 300;
      const logoX = (ticketWidth - logoWidth) / 2;
      const logoY = 50;
      doc.addImage(transparentLogoData, 'PNG', logoX, logoY, logoWidth, logoHeight);

      // Header with Queue Number - Adjusted to respect margins
      doc.setFillColor(95, 141, 78); // #5F8D4E
      const headerWidth = 400; // Fixed header width
      const headerX = (ticketWidth - headerWidth) / 2; // Center the header
      doc.roundedRect(headerX, margin, headerWidth, 50, 10, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(48);
      doc.setFont('helvetica', 'bold');
      doc.text(code, ticketWidth / 2, margin + 35, { align: 'center' });

      // Reset text color to black for the rest of the content
      doc.setTextColor(0, 0, 0);

      yPosition = margin + 80;

      // Welcome text
      doc.setFontSize(24);
      doc.setFont('helvetica', 'normal');
      doc.text("Welcome, you're currently in the queue", ticketWidth / 2, yPosition, { align: 'center' });
      yPosition += 40;

      // Horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin + 20, yPosition, ticketWidth - (margin + 20), yPosition);
      yPosition += 30;

      // Customer details
      doc.setFontSize(20);
      const contentStartX = margin + 40; // Add extra space from margin
      const valueStartX = contentStartX + 100; // Adjust value position

      const details = [
        { label: 'Name:', value: this.customerName || 'John Doe' },
        { label: 'Services:', value: this.showServiceNames() || 'No services selected' },
        { label: 'Time:', value: this.currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { label: 'Date:', value: this.currentDate.toLocaleDateString() }
      ];

      details.forEach(detail => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${detail.label}`, contentStartX, yPosition);
        doc.setFont('helvetica', 'normal');
        const wrappedValue = doc.splitTextToSize(detail.value, ticketWidth - valueStartX - margin - 40);
        doc.text(wrappedValue, valueStartX, yPosition);
        yPosition += 30 * (wrappedValue.length);
      });

      yPosition += 30;

      // Footer text
      doc.setFontSize(16);
      doc.text('Your number will be called shortly.', ticketWidth / 2, ticketHeight - margin - 20, { align: 'center' });

      // Generate PDF as Blob
      const pdfBlob = doc.output('blob');

      // Create a temporary URL for the Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Create a temporary anchor element and trigger download
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfUrl;
      downloadLink.download = `queue_ticket_${this.queueNumber}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up the temporary URL
      URL.revokeObjectURL(pdfUrl);

    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
// Helper function to convert image to base64

  private getBase64Image(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  private makeImageTransparent(base64Image: string, opacity: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.globalAlpha = opacity;
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error('Could not get 2D context'));
        }
      };
      img.onerror = reject;
      img.src = base64Image;
    });
  }
}
