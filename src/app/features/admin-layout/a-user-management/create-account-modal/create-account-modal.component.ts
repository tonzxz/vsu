import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UswagonCoreService } from 'uswagon-core';

interface User {
  username: string;
  fullName: string;
  department: string;
  type: string;
  status: 'Online' | 'Offline';
  password?: string;
}

@Component({
  selector: 'app-create-account-modal',
  templateUrl: './create-account-modal.component.html',
  styleUrls: ['./create-account-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CreateAccountModalComponent {
  

  constructor(private API: UswagonCoreService) {
  }

  async generateRandomID() {
    await this.API.createUniqueID32();
   }

}
