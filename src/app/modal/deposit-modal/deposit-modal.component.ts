import { Component, EventEmitter, Output } from '@angular/core';
import { WalletService } from '../../service/wallet.service';

@Component({
  selector: 'app-deposit-modal',
  templateUrl: './deposit-modal.component.html',
  styleUrls: ['./deposit-modal.component.css'],
})
export class DepositModalComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  currency: string = 'USD';
  cardNumber: string = '';
  depositAmount: number;
  isCardNumberValid: boolean = true;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private walletService: WalletService) {}

  closeModal(): void {
    this.close.emit();
  }

  submitDeposit() {
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
          .depositFunds(this.currency, this.depositAmount)
          .subscribe(
            (response) => {
              this.successMessage = 'Deposit was successful!';
              this.errorMessage = '';
              setTimeout(() => this.closeModal(), 1000);
            },
            (error) => {
              this.errorMessage = 'Deposit failed. Please try again.';
              this.successMessage = '';
              console.error('Deposit failed:', error);
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
