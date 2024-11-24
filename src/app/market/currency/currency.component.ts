import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyInfo } from '../../model/currency-info.model';
import { MarketService } from '../../service/market.service';
import { TradeService } from '../../service/trade.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.css',
})
export class CurrencyComponent implements OnInit {
  currencies: CurrencyInfo[] = [];
  sortBy: string = '';
  sortAscending: boolean = true;

  constructor(
    private marketService: MarketService,
    private tradeService: TradeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.marketService.fetchCurrencyInfos().subscribe(
      (currencies: CurrencyInfo[]) => {
        this.currencies = currencies;
        console.log(this.currencies[0]);

        this.tradeService.getWatchlist().subscribe(
          (watchlist) => {
            this.currencies = this.currencies.map((currency) => {
              currency.is_watchlist_elem = watchlist.includes(currency.symbol);
              return currency;
            });
          },
          (error) => {
            console.error('Failed to fetch watchlist:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching cryptocurrency prices:', error);
      }
    );
  }

  onTrade(currency: string): void {
    this.router.navigate(['/trade', currency]);
  }

  onToggleWatchlistElem(currency: CurrencyInfo): void {
    if (currency.is_watchlist_elem) {
      currency.is_watchlist_elem = false;
      this.tradeService
        .removeWatchlistElem(currency.symbol.toLocaleLowerCase())
        .subscribe(
          () => {},
          (error) => {
            console.error('Error removing watchlist element:', error);
          }
        );
    } else {
      currency.is_watchlist_elem = true;
      this.tradeService
        .addWatchlistElem(currency.symbol.toLocaleLowerCase())
        .subscribe(
          () => {},
          (error) => {
            console.error('Error adding watchlist element:', error);
          }
        );
    }
  }

  sortCurrencies(column: string): void {
    if (this.sortBy === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortBy = column;
      this.sortAscending = true;
    }

    this.currencies.sort((a, b) => {
      const aValue = this.getSortingValue(a, column);
      const bValue = this.getSortingValue(b, column);

      if (aValue === bValue) {
        return 0;
      }

      return (this.sortAscending ? 1 : -1) * (aValue > bValue ? 1 : -1);
    });
  }

  getSortingValue(currency: CurrencyInfo, column: string): any {
    switch (column) {
      case 'rank':
        return currency.market_cap_rank;
      case 'price':
        return currency.current_price;
      case 'priceChange':
        return currency.price_change_percentage_24h;
      case 'volume':
        return currency.total_volume;
      default:
        return '';
    }
  }
}
