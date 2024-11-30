import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TradeService } from '../service/trade.service';
import { FollowService } from '../service/follow.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  userId: number;
  user: any;
  currentPage: number = 1;
  pageSize: number = 10;
  paginatedTrades: any[] = [];
  isFollowing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private tradeService: TradeService,
    private followService: FollowService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = +params['id'];
      this.loadUserDetail(this.userId);
      this.checkIfFollowing(this.userId);
    });
  }

  loadUserDetail(userId: number): void {
    this.tradeService.getUserDetail(userId).subscribe(
      (data: any) => {
        this.user = data;
        this.updatePaginatedTrades();
      },
      (error) => {
        console.error('Failed to fetch user detail:', error);
      }
    );
  }

  checkIfFollowing(followedTraderId: number): void {
    this.getCurrentUserId().subscribe((followerId: number) => {
      this.followService.isFollowing(followerId, followedTraderId).subscribe(
        (isFollowing: boolean) => {
          this.isFollowing = isFollowing;
        },
        (error) => {
          console.error('Failed to check following status:', error);
        }
      );
    });
  }

  follow(): void {
    this.getCurrentUserId().subscribe((followerId: number) => {
      this.followService.followTrader(followerId, this.userId).subscribe(
        () => {
          this.isFollowing = true;
        },
        (error) => {
          console.error('Failed to follow user:', error);
        }
      );
    });
  }

  unfollow(): void {
    this.getCurrentUserId().subscribe((followerId: number) => {
      this.followService.unfollowTrader(followerId, this.userId).subscribe(
        () => {
          this.isFollowing = false;
        },
        (error) => {
          console.error('Failed to unfollow user:', error);
        }
      );
    });
  }

  getCurrentUserId(): Observable<number> {
    return this.followService.getUserId();
  }

  getAverageBuyPrice(): number {
    const totalBuyPrice = this.user.wallet.trades.reduce(
      (sum, trade) => sum + trade.buyPrice,
      0
    );
    return totalBuyPrice / this.user.wallet.trades.length;
  }

  getAverageSellPrice(): number {
    const totalSellPrice = this.user.wallet.trades.reduce(
      (sum, trade) => sum + trade.sellPrice,
      0
    );
    return totalSellPrice / this.user.wallet.trades.length;
  }

  getTotalProfitLoss(): number {
    return this.user.wallet.trades.reduce(
      (sum, trade) => sum + (trade.sellPrice - trade.buyPrice),
      0
    );
  }

  updatePaginatedTrades(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTrades = this.user.wallet.trades.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedTrades();
  }

  getTotalPages(): number {
    return this.user && this.user.wallet && this.user.wallet.trades
      ? Math.ceil(this.user.wallet.trades.length / this.pageSize)
      : 0;
  }

  goBack(): void {
    this.router.navigate(['/leaderboard']);
  }
}
