import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Trade } from '../model/trade.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TradeService {
  private apiUrl = `${environment.apiUrl}/Trade`;
  private apiUrlWatchlist = `${environment.apiUrl}/Watchlist`;
  tradeSuccess: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) {}

  getTrades(): Observable<any[]> {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(`${this.apiUrl}/trades`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getTradeHistory(): Observable<any[]> {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(`${this.apiUrl}/tradehistory`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getTradeDetails(tradeId: number): Observable<Trade> {
    const token = localStorage.getItem('token');

    return this.http.get<Trade>(`${this.apiUrl}/trade/${tradeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  placeLimitOrder(tradeId: number, limitOrderPrice: number): Observable<void> {
    const token = localStorage.getItem('token');

    const url = `${this.apiUrl}/trade/${tradeId}/limitorder`;
    return this.http.post<void>(
      url,
      { price: limitOrderPrice },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  placeStopLossOrder(
    tradeId: number,
    stopLossOrderPrice: number
  ): Observable<void> {
    const token = localStorage.getItem('token');
    const url = `${this.apiUrl}/trade/${tradeId}/stoplossorder`;
    return this.http.post<void>(
      url,
      { price: stopLossOrderPrice },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  getWatchlist(): Observable<any[]> {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(`${this.apiUrlWatchlist}/currencies`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getTopTraders(count: number): Observable<any[]> {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(`${this.apiUrl}/traders?count=${count}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getUserDetail(userId: number): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.get<any>(`${this.apiUrl}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  removeWatchlistElem(symbol: string): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.delete<any>(`${this.apiUrlWatchlist}/remove/${symbol}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  addWatchlistElem(symbol: string): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Adding watchlist element:', symbol);

    return this.http.post<any>(
      `${this.apiUrlWatchlist}/add`,
      { symbol: symbol },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  buyCurrency(
    id: number,
    currencyToBuy: string,
    amountToBuy: number,
    paymentCurrency: string,
    paymentAmount: number,
    name: string
  ): Observable<any> {
    const token = localStorage.getItem('token');
    const payload = {
      Id: id,
      CurrencyToBuy: currencyToBuy,
      AmountToBuy: amountToBuy,
      PaymentCurrency: paymentCurrency.toUpperCase(),
      PaymentAmount: paymentAmount,
      Name: name,
    };
    return this.http
      .post<any>(`${this.apiUrl}/buy`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        tap(() => {
          this.tradeSuccess.emit();
          console.log('Trade successful');
        })
      );
  }

  sellCurrency(
    id: number,
    currencyToBuy: string,
    amountToBuy: number,
    paymentCurrency: string,
    paymentAmount: number,
    name: string
  ): Observable<any> {
    const token = localStorage.getItem('token');
    const payload = {
      Id: id,
      CurrencyToBuy: currencyToBuy,
      AmountToBuy: amountToBuy,
      PaymentCurrency: paymentCurrency.toUpperCase(),
      PaymentAmount: paymentAmount,
      Name: name,
    };

    return this.http
      .post<any>(`${this.apiUrl}/sell`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        tap(() => {
          this.tradeSuccess.emit();
          console.log('Trade successful');
        })
      );
  }
}
