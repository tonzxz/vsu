import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-kiosk-forms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kiosk-forms.component.html',
  styleUrls: ['./kiosk-forms.component.css']
})
export class KioskFormsComponent implements OnInit {
  departmentName: string = '';
  currentTime: Date = new Date();
  currentDate: Date = new Date();
  isChecklistVisible: boolean = false;
  isFormVisible: boolean = false;
  checklist: { name: string, selected: boolean }[] = [
    { name: 'Request Documents', selected: false },
    { name: 'File Documents', selected: false },
    { name: 'Make Payment', selected: false },
    { name: 'Set an Appointment', selected: false },
    { name: 'Other', selected: false }
  ];
  queueNumber: number | null = null;
  selectedServices: string[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.departmentName = params['department'] || 'Department Name';
    });

    this.resetQueueNumberIfNewDay();
  }

  handleButtonClick(type: string): void {
    this.isChecklistVisible = true;
  }

  confirmChecklist(): void {
    this.isChecklistVisible = false;
    this.isFormVisible = true;
    this.queueNumber = this.generateQueueNumber();
    this.selectedServices = this.checklist
      .filter(item => item.selected)
      .map(item => item.name);
  }

  goBack(): void {
    if (this.isFormVisible) {
      this.isFormVisible = false;
      this.isChecklistVisible = true;
    } else if (this.isChecklistVisible) {
      this.isChecklistVisible = false;
    }
  }

  generateQueueNumber(): number {
    const today = new Date().toDateString();
    let lastQueueData = JSON.parse(localStorage.getItem('lastQueueData') || '{}');

    if (lastQueueData.date !== today) {
      lastQueueData = { date: today, lastQueueNumber: 0 };
    }

    lastQueueData.lastQueueNumber += 1;
    localStorage.setItem('lastQueueData', JSON.stringify(lastQueueData));

    return lastQueueData.lastQueueNumber;
  }

  resetQueueNumberIfNewDay(): void {
    const today = new Date().toDateString();
    let lastQueueData = JSON.parse(localStorage.getItem('lastQueueData') || '{}');

    if (lastQueueData.date !== today) {
      localStorage.setItem('lastQueueData', JSON.stringify({ date: today, lastQueueNumber: 0 }));
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
    doc.text(this.queueNumber!.toString(), 40, 30, { align: 'center' });
  
    doc.setFontSize(12);
    doc.text(new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString(), 40, 40, { align: 'center' });
  
    doc.save(`queue_ticket_${this.queueNumber}.pdf`);
  }
  

}
