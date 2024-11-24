import { Component, OnInit } from '@angular/core';
import { TradeService } from '../service/trade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
})
export class LeaderboardComponent implements OnInit {
  traders: any[] = [];
  pagedTraders: any[] = [];
  pageSize: number = 25; // Number of items per page
  currentPage: number = 1;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private tradeService: TradeService, private router: Router) {}

  ngOnInit(): void {
    this.loadTopTraders();
  }

  loadTopTraders(): void {
    this.tradeService.getTopTraders(75).subscribe(
      (data: any) => {
        this.traders = data;
        this.calculatePagination();
      },
      (error) => {
        console.error('Failed to fetch top traders:', error);
      }
    );
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.traders.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.goToPage(1); // Initially load the first page
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.traders.length);
    this.pagedTraders = this.traders.slice(startIndex, endIndex);
  }

  goToUserDetail(userId: number): void {
    if (userId) {
      this.router.navigate(['/user', userId]); // Navigate to user detail page
    } else {
      console.error('User ID is undefined.');
    }
  }
}
