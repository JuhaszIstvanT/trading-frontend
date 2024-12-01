import { Component, OnInit } from '@angular/core';
import { MarketService } from '../../service/market.service';

@Component({
  selector: 'app-market-summary',
  templateUrl: './market-summary.component.html',
  styleUrl: './market-summary.component.css',
})
export class MarketSummaryComponent implements OnInit {
  totalMarketCap: number;
  marketCapChange: number;
  totalVolume: number;

  constructor(private marketService: MarketService) {}

  ngOnInit(): void {
    this.fetchMarketSummary();
  }

  fetchMarketSummary(): void {
    this.marketService.fetchMarketSummary().subscribe(
      (data) => {
        const marketData = data[0];
        this.totalMarketCap = marketData.total_mcap;
        this.marketCapChange = marketData.mcap_change;
        this.totalVolume = marketData.total_volume;
      },
      (error) => {
        console.error('Error fetching market summary:', error);
      }
    );
  }
}
