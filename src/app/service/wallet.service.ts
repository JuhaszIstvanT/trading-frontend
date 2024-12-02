import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  transactionSuccess: EventEmitter<any> = new EventEmitter();
  private apiUrl = `${environment.local}/Wallet`;

  constructor(private http: HttpClient) {}

  getBalances(): Observable<any[]> {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(`${this.apiUrl}/balances`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getAddress(): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.get<any>(`${this.apiUrl}/address`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getPendingTransactions(): Observable<any[]> {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(`${this.apiUrl}/pendingtransactions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getTransactionHistory(): Observable<any[]> {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(`${this.apiUrl}/transactionhistory`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getUserDebitCardNumber(): Observable<string> {
    const token = localStorage.getItem('token');

    return this.http.get<string>(`${this.apiUrl}/debitcardnumber`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  transferFunds(
    from: string,
    to: string,
    currency: string,
    amount: number
  ): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http
      .post<any>(
        `${this.apiUrl}/transfer`,
        { from, to, currency, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .pipe(
        tap(() => {
          this.transactionSuccess.emit();
        })
      );
  }

  depositFunds(currency: string, amount: number): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http
      .post<any>(
        `${this.apiUrl}/deposit`,
        { currency, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .pipe(
        tap(() => {
          this.transactionSuccess.emit();
        })
      );
  }

  withdrawFunds(currency: string, amount: number): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http
      .post<any>(
        `${this.apiUrl}/withdraw`,
        { currency, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .pipe(
        tap((response) => {
          if (response && response.message === 'Withdrawal successful') {
            this.transactionSuccess.emit();
          }
        })
      );
  }

  isValidCardNumber(cardNumber: string): boolean {
    let sum = 0;
    let doubleDigit = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = +cardNumber[i];
      if (doubleDigit) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      doubleDigit = !doubleDigit;
    }
    return sum % 10 === 0;
  }
}