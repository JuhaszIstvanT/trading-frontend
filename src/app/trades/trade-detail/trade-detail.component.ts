import { Component, OnInit } from '@angular/core';
import { Trade } from '../../model/trade.model';
import { ActivatedRoute } from '@angular/router';
import { TradeService } from '../../service/trade.service';
import { MarketService } from '../../service/market.service';

@Component({
  selector: 'app-trade-detail',
  templateUrl: './trade-detail.component.html',
  styleUrls: ['./trade-detail.component.css'],
})
export class TradeDetailComponent implements OnInit {
  trade: Trade;
  actualPrice: number;
  changePercentage: number;
  limitOrderPrice: number;
  stopLossOrderPrice: number;
  successMessage: string;

  constructor(
    private route: ActivatedRoute,
    private tradeService: TradeService,
    private marketService: MarketService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const tradeId = +params['id'];
      this.tradeService.getTradeDetails(tradeId).subscribe((trade) => {
        this.trade = trade;

        this.marketService
          .fetchCurrentPrice(this.trade.name, this.trade.buyCurrency)
          .subscribe(
            (price) => {
              this.actualPrice = price * this.trade.amount;

              const buyPrice = trade.buyPrice;
              const percentageChange =
                ((this.actualPrice - buyPrice) / buyPrice) * 100;
              this.changePercentage = percentageChange;
            },
            (error) => {
              console.error('Failed to fetch current price:', error);
            }
          );
      });
    });
  }
  
  placeStopLossOrder(): void {
    this.tradeService
      .placeStopLossOrder(this.trade.id, this.stopLossOrderPrice)
      .subscribe(
        () => {
          this.refreshTradeDetails();
          this.setSuccessMessage('Stop-loss order placed successfully');
        },
        (error) => {
          console.error('Failed to place stop-loss order:', error);
        }
      );
  }

  setSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 1000);
  }

  refreshTradeDetails(): void {
    this.tradeService.getTradeDetails(this.trade.id).subscribe((trade) => {
      this.trade = trade;
    });
  }
}
