import { Component, EventEmitter, Output } from '@angular/core';
import { WalletService } from '../../service/wallet.service';

@Component({
  selector: 'app-transfer-modal',
  templateUrl: './transfer-modal.component.html',
  styleUrls: ['./transfer-modal.component.css'],
})
export class TransferModalComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  currency: string = 'USD';
  from: string;
  to: string;
  amount: number;

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private walletService: WalletService) {}

  closeModal(): void {
    this.close.emit();
  }

  submitTransfer() {
    if (this.from && this.to && this.amount && this.currency) {
      this.walletService
        .transferFunds(this.from, this.to, this.currency, this.amount)
        .subscribe(
          (response) => {
            const message = response.message;
            if (message === 'Transfer successful') {
              this.successMessage = 'Transfer was successful!';
              this.errorMessage = '';
              setTimeout(() => {
                this.closeModal();
                this.successMessage = ''; // Clear success message after 1 second
              }, 1000);
            } else {
              this.errorMessage = 'Transfer failed. Please try again.';
              console.error('Transfer failed');
            }
          },
          (error) => {
            this.errorMessage = 'Failed to process transfer. Please try again.';
            console.error('Failed to process transfer:', error);
          }
        );
    }
  }
}
