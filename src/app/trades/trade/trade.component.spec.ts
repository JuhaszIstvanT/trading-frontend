import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TradeComponent } from './trade.component';
import { TradeService } from '../../service/trade.service';
import { MarketService } from '../../service/market.service';
import { Trade } from '../../model/trade.model';

describe('TradeComponent', () => {
  let component: TradeComponent;
  let fixture: ComponentFixture<TradeComponent>;
  let tradeService: jasmine.SpyObj<TradeService>;
  let marketService: jasmine.SpyObj<MarketService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const tradeServiceSpy = jasmine.createSpyObj('TradeService', [
      'getTrades',
      'sellCurrency',
    ]);
    const marketServiceSpy = jasmine.createSpyObj('MarketService', [
      'fetchCurrentPrice',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [TradeComponent],
      providers: [
        { provide: TradeService, useValue: tradeServiceSpy },
        { provide: MarketService, useValue: marketServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TradeComponent);
    component = fixture.componentInstance;
    tradeService = TestBed.inject(TradeService) as jasmine.SpyObj<TradeService>;
    marketService = TestBed.inject(MarketService) as jasmine.SpyObj<MarketService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate and fetch actual prices for trades', () => {
    const mockTrades: Trade[] = [
      {
        id: 1,
        buyPrice: 50000,
        buyCurrency: 'USD',
        sellPrice: 0,
        sellCurrency: 'USD',
        symbol: 'BTC',
        name: 'Bitcoin',
        amount: 0.1,
        timestamp: new Date().toISOString(),
        isSold: false,
        limitOrderPrice: 0,
        stopLossOrderPrice: 0,
        limitOrderActive: false,
        stopLossOrderActive: false,
      },
    ];
    const mockPrice = 60000;

    tradeService.getTrades.and.returnValue(of(mockTrades));
    marketService.fetchCurrentPrice.and.returnValue(of(mockPrice));

    component.updateTrades();

    expect(tradeService.getTrades).toHaveBeenCalled();
    expect(marketService.fetchCurrentPrice).toHaveBeenCalledWith('Bitcoin');
    expect(component.actualPrices[1]).toEqual(mockPrice * 0.1);
    expect(component.changePercentage[1]).toEqual(
      ((mockPrice * 0.1 - 50000) / 50000) * 100
    );
  });

  it('should handle errors when fetching trades', () => {
    tradeService.getTrades.and.returnValue(throwError(() => new Error('Error')));

    component.updateTrades();

    expect(tradeService.getTrades).toHaveBeenCalled();
    expect(component.trades).toBeUndefined();
  });

  it('should handle errors when fetching actual prices', () => {
    const mockTrades: Trade[] = [
      {
        id: 1,
        buyPrice: 50000,
        buyCurrency: 'USD',
        sellPrice: 0,
        sellCurrency: 'USD',
        symbol: 'BTC',
        name: 'Bitcoin',
        amount: 0.1,
        timestamp: new Date().toISOString(),
        isSold: false,
        limitOrderPrice: 0,
        stopLossOrderPrice: 0,
        limitOrderActive: false,
        stopLossOrderActive: false,
      },
    ];
    tradeService.getTrades.and.returnValue(of(mockTrades));
    marketService.fetchCurrentPrice.and.returnValue(throwError(() => new Error('Error')));

    component.updateTrades();

    expect(marketService.fetchCurrentPrice).toHaveBeenCalledWith('Bitcoin');
    expect(component.actualPrices[1]).toBeUndefined();
  });

  it('should navigate to trade details on row click', () => {
    component.navigateToTradeDetails(1);
    expect(router.navigate).toHaveBeenCalledWith(['/trade/detail', 1]);
  });
});
