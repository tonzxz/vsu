// confirmation-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  /**
   * Handles the Save action.
   * Closes the dialog and returns 'save' as the result.
   */
  onSave(): void {
    this.dialogRef.close('save');
  }

  /**
   * Handles the Discard action.
   * Closes the dialog and returns 'discard' as the result.
   */
  onDiscard(): void {
    this.dialogRef.close('discard');
  }

  /**
   * Handles the Cancel action.
   * Closes the dialog and returns 'cancel' as the result.
   */
  onCancel(): void {
    this.dialogRef.close('cancel');
  }
}
