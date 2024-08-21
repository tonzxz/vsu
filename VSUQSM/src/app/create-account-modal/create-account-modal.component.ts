import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-create-account-modal',
  standalone: true,
  imports: [],
  templateUrl: './create-account-modal.component.html',
  styleUrl: './create-account-modal.component.css'
})
export class CreateAccountModalComponent {
  @Input() showModal: boolean = false;
  @Input() locations: string[] = [];
  @Input() accountTypes: string[] = [];
  @Input() newAccount: any = {};

  @Output() createAccount = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  createNewAccount() {
    this.createAccount.emit();
  }

  close() {
    this.closeModal.emit();
  }
}