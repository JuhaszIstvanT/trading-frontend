import { Component, OnInit } from '@angular/core';
import { WalletService } from '../service/wallet.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css'],
})
export class TransactionHistoryComponent implements OnInit {
  transactions: any[];
  filteredTransactions: any[];
  paginatedTransactions: any[];
  selectedType: string = 'All';
  sortOrders: { [key: string]: string } = {
    date: 'desc',
    amount: 'desc',
  };
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.updateTransactions();
    this.walletService.transactionSuccess.subscribe(() => {
      this.updateTransactions();
    });
  }

  updateTransactions(): void {
    this.walletService.getTransactionHistory().subscribe(
      (transactions) => {
        this.transactions = transactions;
        this.filterTransactionsByType();
      },
      (error) => {
        console.error('Failed to fetch transactions:', error);
      }
    );
  }

  sortTransactionsByDate(transactions: any[]): void {
    const order = this.sortOrders.date === 'asc' ? 1 : -1;
    this.filteredTransactions = [...transactions].sort((a, b) => {
      return order * (new Date(b.date).getTime() - new Date(a.date).getTime());
    });
    this.sortOrders.date = this.sortOrders.date === 'asc' ? 'desc' : 'asc';
    this.paginateTransactions();
  }

  sortTransactionsByAmount(transactions: any[]): void {
    const order = this.sortOrders.amount === 'asc' ? 1 : -1;
    this.filteredTransactions = [...transactions].sort((a, b) => {
      return order * (b.amount - a.amount);
    });
    this.sortOrders.amount = this.sortOrders.amount === 'asc' ? 'desc' : 'asc';
    this.paginateTransactions();
  }

  filterTransactionsByType(): void {
    if (this.selectedType === 'All') {
      this.filteredTransactions = [...this.transactions];
    } else {
      this.filteredTransactions = this.transactions.filter((transaction) => {
        return transaction.type === this.selectedType;
      });
    }
    if (this.sortOrders.date === 'asc') {
      this.sortTransactionsByDate(this.filteredTransactions);
    } else {
      this.sortTransactionsByAmount(this.filteredTransactions);
    }
    this.paginateTransactions();
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateTransactions();
    }
  }

  paginateTransactions(): void {
    this.totalPages = Math.ceil(
      this.filteredTransactions.length / this.itemsPerPage
    );
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTransactions = this.filteredTransactions.slice(
      startIndex,
      endIndex
    );
  }
}
