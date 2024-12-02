import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WatchlistComponent } from './watchlist.component';
import { MarketService } from '../service/market.service';
import { TradeService } from '../service/trade.service';
import { of } from 'rxjs';
import { CurrencyInfo } from '../model/currency-info.model';

describe('WatchlistComponent', () => {
  let component: WatchlistComponent;
  let fixture: ComponentFixture<WatchlistComponent>;
  let marketService: MarketService;
  let tradeService: TradeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WatchlistComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [MarketService, TradeService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchlistComponent);
    component = fixture.componentInstance;
    marketService = TestBed.inject(MarketService);
    tradeService = TestBed.inject(TradeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to trade page', () => {
    const mockCurrency = 'btc';
    spyOn(component['router'], 'navigate').and.returnValue(
      Promise.resolve(true)
    );

    component.onTrade(mockCurrency);

    expect(component['router'].navigate).toHaveBeenCalledWith([
      '/trade',
      'btc',
    ]);
  });
});
