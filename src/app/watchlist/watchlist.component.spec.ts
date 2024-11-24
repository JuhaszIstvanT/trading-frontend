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

  it('should update watchlist', () => {
    const mockCurrencies: CurrencyInfo[] = [
      {
        image: 'image-url',
        market_cap_rank: 1,
        name: 'Bitcoin',
        symbol: 'BTC',
        current_price: 50000,
        price_change_percentage_24h: 5,
        total_volume: 100000,
        market_cap: 9000000,
        is_watchlist_elem: true,
      },
    ];

    spyOn(marketService, 'fetchCurrencyInfos').and.returnValue(
      of(mockCurrencies)
    );
    spyOn(tradeService, 'getWatchlist').and.returnValue(of(['BTC']));

    component.ngOnInit();

    expect(component.currencies.length).toBe(1);
    expect(component.currencies[0].symbol).toBe('BTC');
    expect(component.currencies[0].is_watchlist_elem).toBe(true);
  });

  it('should remove watchlist element', () => {
    const mockCurrency: CurrencyInfo = {
      image: 'image-url',
      market_cap_rank: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      current_price: 50000,
      price_change_percentage_24h: 5,
      total_volume: 100000,
      market_cap: 9000000,
      is_watchlist_elem: true,
    };

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(tradeService, 'removeWatchlistElem').and.returnValue(of(null));
    spyOn(component, 'updateWatchlist');

    component.onRemoveWatchlistElem(mockCurrency);

    expect(tradeService.removeWatchlistElem).toHaveBeenCalledWith('BTC');
    expect(component.updateWatchlist).toHaveBeenCalled();
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
