import { Component, EventEmitter, Output } from '@angular/core';
import { WalletService } from '../../service/wallet.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-withdrawal-modal',
  templateUrl: './withdrawal-modal.component.html',
  styleUrls: ['./withdrawal-modal.component.css'],
})
export class WithdrawalModalComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  withdrawalCurrency: string = 'USD';
  cardNumber: string = '';
  withdrawalAmount: number;
  isCardNumberValid: boolean = true;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private walletService: WalletService) {}

  closeModal(): void {
    this.close.emit();
  }

  submitWithdrawal() {
    this.walletService.getUserDebitCardNumber().subscribe(
      (userCardNumber) => {
        this.isCardNumberValid =
          this.walletService.isValidCardNumber(this.cardNumber) &&
          this.cardNumber == userCardNumber;

        if (!this.isCardNumberValid) {
          this.errorMessage = 'Invalid debit card number';
          return;
        }

        this.walletService
          .withdrawFunds(this.withdrawalCurrency, this.withdrawalAmount)
          .subscribe(
            (response) => {
              const msg = response.message;
              if (msg === 'Withdrawal successful') {
                this.successMessage = 'Withdrawal was successful!';
                this.errorMessage = '';
                setTimeout(() => this.closeModal(), 1000); // Close the modal after 1 second
              } else {
                this.errorMessage = 'Withdrawal failed. Please try again.';
                this.successMessage = '';
                console.error('Withdrawal failed');
              }
            },
            (error) => {
              this.errorMessage =
                'Failed to process withdrawal. Please try again.';
              this.successMessage = '';
              console.error('Failed to process withdrawal:', error);
            }
          );
      },
      (error) => {
        this.errorMessage = 'Failed to fetch user debit card number';
        console.error('Failed to fetch user debit card number:', error);
      }
    );
  }
}
