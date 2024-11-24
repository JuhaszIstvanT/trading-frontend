import { Component, OnInit } from '@angular/core';
import { WalletService } from '../service/wallet.service';
import { TradeService } from '../service/trade.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class WalletComponent implements OnInit {
  address: any;
  pendingTransactions: any[];
  balances: any[];

  showDepositModal = false;
  showWithdrawalModal = false;
  showTransferModal = false;

  constructor(
    private walletService: WalletService,
    private tradeService: TradeService
  ) {}

  ngOnInit(): void {
    this.getAddress();
    this.updateBalances();
    this.updatePendingTransactions();

    this.tradeService.tradeSuccess.subscribe(() => {
      this.updateBalances();
    });

    this.walletService.transactionSuccess.subscribe(() => {
      this.updateBalances();
      this.updatePendingTransactions();
    });
  }

  getAddress(): void {
    this.walletService.getAddress().subscribe(
      (address) => {
        this.address = address.address;
      },
      (error) => {
        console.error('Failed to fetch address:', error);
      }
    );
  }

  updateBalances(): void {
    this.walletService.getBalances().subscribe(
      (balances) => {
        this.balances = balances;
      },
      (error) => {
        console.error('Failed to fetch updated balances:', error);
      }
    );
  }

  updatePendingTransactions(): void {
    this.walletService.getPendingTransactions().subscribe(
      (transactions) => {
        this.pendingTransactions = transactions;
      },
      (error) => {
        console.error('Failed to fetch updated balances:', error);
      }
    );
  }

  showDepositModalFunc(): void {
    this.showDepositModal = true;
  }

  showWithdrawalModalFunc(): void {
    this.showWithdrawalModal = true;
  }

  showTransferModalFunc(): void {
    this.showTransferModal = true;
  }
}
