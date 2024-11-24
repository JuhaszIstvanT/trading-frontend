import { Component } from '@angular/core';
import { CurrencyInfo } from '../model/currency-info.model';
import { MarketService } from '../service/market.service';
import { Router } from '@angular/router';
import { TradeService } from '../service/trade.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css',
})
export class WatchlistComponent {
  currencies: CurrencyInfo[] = [];

  constructor(
    private marketService: MarketService,
    private tradeService: TradeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.marketService.fetchCurrencyInfos().subscribe(
      (currencies: CurrencyInfo[]) => {
        this.currencies = currencies;

        this.updateWatchlist();
      },
      (error) => {
        console.error('Error fetching cryptocurrency prices:', error);
      }
    );
  }

  updateWatchlist(): void {
    this.tradeService.getWatchlist().subscribe((watchlist) => {
      this.currencies = this.currencies.filter((currency) =>
        watchlist.includes(currency.symbol)
      );
      this.currencies = this.currencies.map((currency) => {
        currency.is_watchlist_elem = watchlist.includes(currency.symbol);
        return currency;
      });
    });
    console.log('Watchlist:', this.currencies);
    
  }

  onRemoveWatchlistElem(currency: CurrencyInfo): void {
    this.tradeService.removeWatchlistElem(currency.symbol).subscribe(
      () => {
        this.updateWatchlist();
      },
      (error) => {
        console.error('Error removing watchlist element:', error);
      }
    );
  }

  onTrade(currency: string): void {
    this.router.navigate(['/trade', currency]);
  }
}
