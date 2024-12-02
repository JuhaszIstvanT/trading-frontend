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
  selectedCurrencySymbol: string = '';
  amountError: string = '';

  constructor(
    private tradeService: TradeService,
    private route: ActivatedRoute,
    private marketService: MarketService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.selectedCurrency = params.get('currency') || 'bitcoin';
      this.convertCurrency();
    });
  }

  convertCurrency(): void {
    this.marketService.fetchTickerData().subscribe(
      (response) => {
        const coin = response.data.find(
          (coin: any) => coin.name.toLowerCase() === this.selectedCurrency.toLowerCase()
        );
  
        if (!coin) {
          console.error(`Currency ${this.selectedCurrency} not found.`);
          return;
        }
  
        this.marketService.fetchSpecificTickerData(coin.id).subscribe(
          (data) => {
            if (data.length === 0) {
              console.error(`Price data for ${this.selectedCurrency} not found.`);
              return;
            }
  
            this.selectedCurrencyValue = +data[0].price_usd;
            this.convertedAmount = this.selectedAmount * this.selectedCurrencyValue;
            this.selectedCurrencySymbol = coin.symbol;
  
            console.log(`Converted Amount: ${this.convertedAmount}`);
          },
          (error) => {
            console.error('Error fetching price for currency:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching currency data:', error);
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
        this.selectedCurrencySymbol,
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
