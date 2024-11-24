import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TradeService } from '../service/trade.service';
import { ActivatedRoute } from '@angular/router';
import { MarketService } from '../service/market.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css'],
})
export class CurrencyConverterComponent {
  selectedCurrency: string = 'bitcoin';
  targetCurrency: string = 'usd';
  selectedAmount: number = 1;
  selectedCurrencyValue: number = 0;
  convertedAmount: number = 0;
  successMessage: string = '';
  errorMessage: string = '';
  selectedCurrencySymbol: string = ''; // Add a property for the symbol
  amountError: string = ''; // Add a property for amount validation error

  private apiKey = 'CG-JzHexe4U5tYy5YeiK8ExpL8y';

  constructor(
    private http: HttpClient,
    private tradeService: TradeService,
    private route: ActivatedRoute,
    private marketService: MarketService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.selectedCurrency = params.get('currency') || 'bitcoin';
      this.convertCurrency();
      this.fetchCryptoSymbol(); // Fetch the symbol when the component initializes
    });
  }

  convertCurrency(): void {
    const endpoint = `https://api.coingecko.com/api/v3/simple/price?ids=${this.selectedCurrency}&vs_currencies=${this.targetCurrency}&apiKey=${this.apiKey}`;
    this.http.get<any>(endpoint).subscribe(
      (data) => {
        this.selectedCurrencyValue =
          data[this.selectedCurrency][this.targetCurrency];
        this.convertedAmount = this.selectedAmount * this.selectedCurrencyValue;
      },
      (error) => {
        console.error('Error fetching currency conversion:', error);
      }
    );
  }

  fetchCryptoSymbol(): void {
    this.marketService.getCryptoDetails(this.selectedCurrency).subscribe(
      (data) => {
        this.selectedCurrencySymbol = data.symbol.toUpperCase();
      },
      (error) => {
        console.error('Error fetching cryptocurrency symbol:', error);
      }
    );
  }

  onAmountChange(event: any): void {
    this.selectedAmount = +event.target.value;
    if (this.selectedAmount < 0) {
      this.amountError = 'Amount must be a positive number';
      this.selectedAmount = 0;
    } else {
      this.amountError = '';
    }
    this.convertedAmount = this.selectedAmount * this.selectedCurrencyValue;
  }

  onCurrencyChange(event: any): void {
    this.targetCurrency = event.target.value;
    this.convertCurrency();
  }

  onTrade(): void {
    if (this.selectedAmount <= 0) {
      this.errorMessage = 'Trade amount must be greater than zero.';
      this.successMessage = '';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
      return;
    }

    this.tradeService
      .buyCurrency(
        -1,
        this.selectedCurrencySymbol, // Use the symbol instead of the name
        this.selectedAmount,
        this.targetCurrency,
        this.convertedAmount,
        this.selectedCurrency
      )
      .subscribe(
        (response: any) => {
          if (response.message === 'Trade successful') {
            this.successMessage = response.message;
            this.errorMessage = '';
            setTimeout(() => {
              this.successMessage = '';
            }, 1000);
          } else {
            this.errorMessage = "Trade wasn't successful";
            this.successMessage = '';
            setTimeout(() => {
              this.errorMessage = '';
            }, 3000);
          }
        },
        (error) => {
          console.error('Failed to make trade:', error);
          this.errorMessage = 'Failed to make trade.';
          this.successMessage = '';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      );
  }
}
