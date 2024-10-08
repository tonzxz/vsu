//kiosk-forms.components.ts
import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import jsPDF from 'jspdf';
import { UswagonCoreService } from 'uswagon-core';

@Component({
  selector: 'app-kiosk-forms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kiosk-forms.component.html',
  styleUrls: ['./kiosk-forms.component.css']
})
export class KioskFormsComponent implements OnInit {
  
  departmentName: string = '';
  currentPeriod: string = 'AM';
  currentTime: Date = new Date();
  currentDate: Date = new Date();
  isChecklistVisible: boolean = false;    
  isFormVisible: boolean = false;
  showModal: boolean = false;  // Modal visibility
  checklist: { name: string, selected: boolean }[] = [
    { name: 'Request Documents', selected: false },
    { name: 'File Documents', selected: false },
    { name: 'Make Payment', selected: false },
    { name: 'Set an Appointment', selected: false },
    { name: 'Other', selected: false }
  ];
  queueNumber: string | null = null;
  selectedServices: string[] = [];
  selectedType: string = '';

  constructor(private route: ActivatedRoute, private kenAPI: UswagonCoreService) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.departmentName = params['department'] || 'Department Name';
    }
    
  );


  this.kenAPI.initializeForm(
    ['role', 'password'])
  
  this.kenAPI.handleFormValue('role', 'desk_attendant');
  this.kenAPI.handleFormValue('password','test'); 

  const data = await this.kenAPI.read({
    selectors: ['*'],
    tables: 'users',
    conditions: `WHERE role='${this.kenAPI.coreForm['role']}'`
  })

  if(data.success) {
    for(let user of data.output){
      alert(JSON.stringify(`${user.firstname}  `));
      console.log('hehe', user.role);
    }
  }  
 
  
    this.resetQueueNumberIfNewDay();
    this.kenAPI.addSocketListener
  }

  handleButtonClick(type: string): void {
    this.isChecklistVisible = true;
    this.selectedType = type;
  }

  toggleSelection(serviceName: string): void {
    const service = this.checklist.find(item => item.name === serviceName);
    if (service) {
      service.selected = !service.selected;
    }
  }

  confirmChecklist(): void {
    this.isChecklistVisible = true;
    this.queueNumber = this.generateQueueNumber();
    this.selectedServices = this.checklist
      .filter(item => item.selected)
      .map(item => item.name);
    this.showModal = true;  // Show the modal
  }

  goBack(): void {
    if (this.isFormVisible) {
      this.isFormVisible = false;
      this.isChecklistVisible = true;
    } else if (this.isChecklistVisible) {
      this.isChecklistVisible = false;
    }
    this.showModal = false;  // Close the modal
  }

  closeModal(): void {
    this.showModal = false;  // Hide the modal
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

  printPDF(): void {
    const doc = new jsPDF({
      orientation: 'landscape', 
      unit: 'mm',
      format: [80, 58]  
    });
  
    doc.setFontSize(24);
    doc.text(this.departmentName.toUpperCase(), 40, 10, { align: 'center' });
  
    doc.setFontSize(50);
    doc.text(this.queueNumber!, 40, 30, { align: 'center' });
  
    doc.setFontSize(12);
    doc.text(new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString(), 40, 40, { align: 'center' });
  
    doc.save(`queue_ticket_${this.queueNumber}.pdf`);
  }


  async kenButton() {

    const data = await this.kenAPI.read({
      selectors: ['*'],
      tables: 'users',
      conditions: `WHERE role='${this.kenAPI.coreForm['role']}'`
    })

    if(data.success) {
      for(let user of data.output){
        alert(JSON.stringify(`${user.firstname}  `));
        console.log('hehe', user.role);
      }
    }
  }
}
