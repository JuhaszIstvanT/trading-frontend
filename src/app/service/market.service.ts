import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

import { CurrencyInfo } from '../model/currency-info.model';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  private apiUrl = environment.local;

  constructor(private http: HttpClient) {}

  fetchCurrentPrice(currency: string): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/Market/tickers`).pipe(
      map((response) => {
        const coin = response.data.find(
          (coin: any) =>
            coin.symbol.toLowerCase() === currency.toLowerCase() ||
            coin.name.toLowerCase() === currency.toLowerCase()
        );
        if (!coin) {
          throw new Error(`Currency ${currency} not found`);
        }
        return coin.id;
      }),
      switchMap((coinId: string) =>
        this.http.get<any[]>(`${this.apiUrl}/Market/ticker/?id=${coinId}`).pipe(
          map((response) => {
            if (response.length === 0) {
              throw new Error(`Price data for currency ${currency} not found`);
            }
            return +response[0].price_usd;
          })
        )
      ),
      catchError((error) => {
        console.error('Failed to fetch current price:', error);
        throw error;
      })
    );
  }
  

  fetchCurrencyInfos(): Observable<CurrencyInfo[]> {
    return this.http
      .get<any>(`${this.apiUrl}/Market/tickers`)
      .pipe(
        map((response: any) => {
          const data = response.data;
          return data.map((crypto: any) => ({
            market_cap_rank: crypto.rank,
            name: crypto.name,
            symbol: crypto.symbol,
            current_price: crypto.price_usd,
            price_change_percentage_24h: crypto.percent_change_24h,
            total_volume: crypto.volume24,
            market_cap: crypto.market_cap_usd,
            is_watchlist_elem: false,
          }));
        })
      );
  }

  fetchTickerData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Market/tickers`);
  }

  fetchSpecificTickerData(coinIds: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Market/ticker?id=${coinIds}`);
  }
  

  fetchMarketSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Market/global`);
  }
}
