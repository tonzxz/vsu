//kiosk-forms.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import { UswagonCoreService } from 'uswagon-core';
import { QueueService } from '../../../services/queue.service';
import { KioskService } from '../../../services/kiosk.service';
import { DivisionService } from '../../../services/division.service';

@Component({
  selector: 'app-kiosk-forms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kiosk-forms.component.html',
  styleUrls: ['./kiosk-forms.component.css']
})
export class KioskFormsComponent implements OnInit {
  [x: string]: any;

  departmentName: string = '';
  currentPeriod: string = 'AM';
  currentTime: Date = new Date();
  currentDate: Date = new Date();
  isChecklistVisible: boolean = false;
  isFormVisible: boolean = false;
  showModal: boolean = false;
  checklist: { name: string, selected: boolean }[] = [
    { name: 'Request Documents', selected: false },
    { name: 'File Documents', selected: false },
    { name: 'Make Payment', selected: false },
    { name: 'Set an Appointment', selected: false },
    { name: 'Other', selected: false },
  ];
  queueNumber: string | null = null;
  selectedServices: string[] = [];
  selectedType: 'regular' | 'priority' = 'regular';
  customerName: string = '';
  gender: string = '';
  department: string = '';
  studentNumber: string = '';

  filteredChecklist = [...this.checklist];
  searchTerm: string = '';
  isDropdownOpen: boolean = false;


  constructor(private route: ActivatedRoute,
    private queueService: QueueService,
    private kioskService: KioskService,
    private divisionService: DivisionService,
    private API: UswagonCoreService) {}



    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
      if (this.isDropdownOpen) {
        this.filterChecklist(); // Ensure all items are shown when opened
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
      this.queueService.getTodayQueues(true);
    } else {
      throw new Error('Invalid method');
    }

    this.resetQueueNumberIfNewDay();
  }

  handleButtonClick(type: 'regular' | 'priority'): void {
    this.isChecklistVisible = true;
    this.selectedType = type;
  }

  toggleSelection(serviceName: string) {
    const service = this.checklist.find(item => item.name === serviceName);
    if (service) {
      service.selected = !service.selected;
      if (service.selected) {
        this.selectedServices.push(serviceName);
      } else {
        this.selectedServices = this.selectedServices.filter(name => name !== serviceName);
      }
    }
  }

  filterChecklist() {
    this.filteredChecklist = this.checklist.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  confirmChecklist(): void {
    this.isChecklistVisible = true;
    this.queueNumber = this.generateQueueNumber();
    this.selectedServices = this.checklist
      .filter(item => item.selected)
      .map(item => item.name);
    this.showModal = true;
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

  async submitForm() {
    console.log(this.kioskService.kiosk);
    if (!this.kioskService.kiosk) {
      throw new Error('Invalid method!');
    }

    const number = await this.queueService.addToQueue({
      fullname: this.customerName,
      type: this.selectedType,
      gender: this.gender as 'male' | 'female' | 'other', // Type assertion here
      services: this.selectedServices
    });

    alert(`Your code is ${this.selectedType === 'regular' ? 'R' : 'P'}-${number}`);
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

  async printPDF(): Promise<void> {
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
      doc.text(this.queueNumber || 'R-0001', ticketWidth / 2, margin + 35, { align: 'center' });

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
        { label: 'Services:', value: this.selectedServices.join(', ') || 'No services selected' },
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
