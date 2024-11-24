import { Component, OnInit } from '@angular/core';
import { MarketService } from '../../service/market.service';

@Component({
  selector: 'app-market-summary',
  templateUrl: './market-summary.component.html',
  styleUrl: './market-summary.component.css',
})
export class MarketSummaryComponent implements OnInit {
  trendingCurrencies: any[] = [];
  totalMarketCap: number;
  marketCapChange: number;
  totalVolume: number;

  constructor(private marketService: MarketService) {}

  ngOnInit(): void {
    this.fetchMarketSummary();
    this.fetchTrendingCurrencies();
  }

  fetchMarketSummary(): void {
    this.marketService.fetchMarketSummary().subscribe(
      (data) => {
        this.totalMarketCap = data.data.total_market_cap.usd;
        this.marketCapChange = data.data.market_cap_change_percentage_24h_usd;
        this.totalVolume = data.data.total_volume.usd;
      },
      (error) => {
        console.error('Error fetching market summary:', error);
      }
    );
  }

  fetchTrendingCurrencies(): void {
    this.marketService.fetchTrendingCurrencies().subscribe(
      (data) => {
        this.trendingCurrencies = data.coins.slice(0, 5);
      },
      (error) => {
        console.error('Error fetching trending cryptocurrencies:', error);
      }
    );
  }
}
