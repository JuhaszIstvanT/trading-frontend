import { Component, OnInit } from '@angular/core';
import { TradeService } from '../../service/trade.service';
import { MarketService } from '../../service/market.service';
import { Trade } from '../../model/trade.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css'],
})
export class TradeComponent implements OnInit {
  trades: Trade[];
  actualPrice: number;
  actualPrices: { [key: string]: number } = {};
  changePercentage: { [key: string]: number } = {};
  successMessage: string;

  constructor(
    private tradeService: TradeService,
    private marketService: MarketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateTrades();

    this.tradeService.tradeSuccess.subscribe(() => {
      this.updateTrades();
    });
  }

  onSellTrade(trade: Trade): void {
    this.marketService
      .fetchCurrentPrice(trade.name, trade.buyCurrency)
      .subscribe(
        (price) => {
          this.actualPrice = price * trade.amount;

          this.tradeService
            .sellCurrency(
              trade.id,
              trade.symbol,
              trade.amount,
              trade.buyCurrency,
              this.actualPrice,
              trade.name
            )
            .subscribe(
              () => {
                this.updateTrades();
                this.successMessage = 'Trade sold successfully';
                this.clearSuccessMessage();
              },
              (error) => {
                console.error('Failed to sell currency:', error);
              }
            );
        },
        (error) => {
          console.error('Failed to fetch current price:', error);
        }
      );
  }

  clearSuccessMessage(): void {
    setTimeout(() => {
      this.successMessage = '';
    }, 1000); // Clear the message after 3 seconds
  }

  updateTrades(): void {
    this.tradeService.getTrades().subscribe(
      (trades) => {
        this.trades = trades;
        this.fetchActualPrices();
      },
      (error) => {
        console.error('Failed to fetch updated orders:', error);
      }
    );
  }

  fetchActualPrices(): void {
    this.trades.forEach((trade) => {
      this.marketService
        .fetchCurrentPrice(trade.name, trade.buyCurrency)
        .subscribe(
          (price) => {
            const currentPrice = price * trade.amount;
            this.actualPrices[trade.id] = currentPrice;

            const buyPrice = trade.buyPrice;
            const percentageChange =
              ((currentPrice - buyPrice) / buyPrice) * 100;
            this.changePercentage[trade.id] = percentageChange;
          },
          (error) => {
            console.error('Failed to fetch current price:', error);
          }
        );
    });
  }

  navigateToTradeDetails(tradeId: number): void {
    this.router.navigate(['/trade/detail', tradeId]);
  }
}
