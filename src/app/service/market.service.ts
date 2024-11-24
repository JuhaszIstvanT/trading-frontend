import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { CurrencyInfo } from '../model/currency-info.model';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  private apiUrl = 'https://api.coingecko.com/api/v3';
  private apiKey = 'CG-JzHexe4U5tYy5YeiK8ExpL8y';

  constructor(private http: HttpClient) {}

  fetchCurrentPrice(currency: string, fiat: string): Observable<number> {

    fiat = fiat.toLowerCase();

    const endpoint = `${this.apiUrl}/simple/price?ids=${currency}&vs_currencies=${fiat}&apiKey=${this.apiKey}`;

    return this.http.get<any>(endpoint).pipe(
      map((response) => response[currency][fiat]),
      catchError((error) => {
        console.error('Failed to fetch current price:', error);
        throw error;
      })
    );
  }

  fetchCurrencyInfos(): Observable<CurrencyInfo[]> {
    return this.http
      .get<any[]>(
        `${this.apiUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false&locale=en&apiKey=${this.apiKey}`
      )
      .pipe(
        map((data: any[]) => {
          return data.map((crypto) => ({
            image: crypto.image,
            market_cap_rank: crypto.market_cap_rank,
            name: crypto.name,
            symbol: crypto.symbol,
            current_price: crypto.current_price,
            price_change_percentage_24h: crypto.price_change_percentage_24h,
            total_volume: crypto.total_volume,
            market_cap: crypto.market_cap,
            is_watchlist_elem: false,
          }));
        })
      );
  }

  fetchMarketSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/global`);
  }

  fetchTrendingCurrencies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search/trending`);
  }

  getCryptoDetails(cryptoId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/coins/${cryptoId}`);
  }
}
