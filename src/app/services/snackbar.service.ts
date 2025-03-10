import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.snackbar.open(message, 'Close', {
      duration: 3000,
    });
  }

  showError(message: string): void {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      panelClass: 'error-snackbar',
    });
  }
}
