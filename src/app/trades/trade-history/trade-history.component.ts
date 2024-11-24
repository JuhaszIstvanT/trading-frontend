import { Component, OnInit } from '@angular/core';
import { TradeService } from '../../service/trade.service';
import { Trade } from '../../model/trade.model';

@Component({
  selector: 'app-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.css'],
})
export class TradeHistoryComponent implements OnInit {
  totalInvestments: number = 0;
  totalRevenue: number = 0;
  trades: Trade[] = [];
  paginatedTrades: Trade[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  sortTrades: { [key: string]: string } = {
    date: 'desc',
    amount: 'desc',
  };

  constructor(private tradeService: TradeService) {}

  ngOnInit(): void {
    this.updateTrades();
    this.tradeService.tradeSuccess.subscribe(() => {
      this.updateTrades();
    });
  }

  updateTrades(): void {
    this.tradeService.getTradeHistory().subscribe(
      (trades) => {
        this.trades = trades;
        this.calculateStatistics();
        this.updatePaginatedTrades();
      },
      (error) => {
        console.error('Failed to fetch trades:', error);
      }
    );
  }

  sortTradesByDate(): void {
    const direction = this.sortTrades.date === 'asc' ? 1 : -1;
    this.trades = [...this.trades].sort((a, b) => {
      return (
        direction *
        (new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      );
    });
    this.sortTrades.date = this.sortTrades.date === 'asc' ? 'desc' : 'asc';
    this.updatePaginatedTrades();
  }

  sortTradesByAmount(): void {
    const direction = this.sortTrades.amount === 'asc' ? 1 : -1;
    this.trades = [...this.trades].sort((a, b) => {
      return direction * (b.amount - a.amount);
    });
    this.sortTrades.amount = this.sortTrades.amount === 'asc' ? 'desc' : 'asc';
    this.updatePaginatedTrades();
  }

  calculateStatistics(): void {
    this.totalRevenue = this.trades.reduce(
      (total, trade) => total + trade.sellPrice,
      0
    );
    this.totalInvestments = this.trades.reduce(
      (total, trade) => total + trade.buyPrice,
      0
    );
  }

  updatePaginatedTrades(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTrades = this.trades.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedTrades();
  }

  getTotalPages(): number {
    return this.trades ? Math.ceil(this.trades.length / this.pageSize) : 0;
  }
}
