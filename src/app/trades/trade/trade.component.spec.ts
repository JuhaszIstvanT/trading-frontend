import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TradeComponent } from './trade.component';
import { TradeService } from '../../service/trade.service';
import { MarketService } from '../../service/market.service';
import { of, throwError, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Trade } from '../../model/trade.model';

describe('TradeComponent', () => {
  let component: TradeComponent;
  let fixture: ComponentFixture<TradeComponent>;
  let tradeServiceMock: any;
  let marketServiceMock: any;
  let router: Router;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    tradeServiceMock = jasmine.createSpyObj(
      'TradeService',
      ['getTrades', 'sellCurrency'],
      {
        tradeSuccess: new Subject<void>(),
      }
    );

    marketServiceMock = jasmine.createSpyObj('MarketService', [
      'fetchCurrentPrice',
    ]);

    await TestBed.configureTestingModule({
      declarations: [TradeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: TradeService, useValue: tradeServiceMock },
        { provide: MarketService, useValue: marketServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display trades on initialization', () => {
    const trades: Trade[] = [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        buyPrice: 30000,
        buyCurrency: 'USD',
        symbol: 'BTC',
        amount: 1,
        limitOrderActive: true,
        stopLossOrderActive: false,
        name: 'Bitcoin',
        sellPrice: undefined,
        sellCurrency: undefined,
        isSold: false,
        limitOrderPrice: undefined,
        stopLossOrderPrice: undefined,
      },
    ];

    tradeServiceMock.getTrades.and.returnValue(of(trades));
    marketServiceMock.fetchCurrentPrice.and.returnValue(of(35000));

    component.ngOnInit();
    fixture.detectChanges();

    expect(tradeServiceMock.getTrades).toHaveBeenCalled();
    expect(component.trades).toEqual(trades);

    const compiled = fixture.nativeElement;
    const tradeRows = compiled.querySelectorAll('.trade-row');
    expect(tradeRows.length).toBe(1);
    expect(tradeRows[0].textContent).toContain('Bitcoin');
    expect(tradeRows[0].textContent).toContain('USD');
    expect(tradeRows[0].textContent).toContain('30000');
    expect(tradeRows[0].textContent).toContain('35000');
  });

  it('should handle error while fetching trades', () => {
    const consoleSpy = spyOn(console, 'error');
    tradeServiceMock.getTrades.and.returnValue(
      throwError('Error fetching trades')
    );

    component.ngOnInit();
    fixture.detectChanges();

    expect(tradeServiceMock.getTrades).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch updated orders:',
      'Error fetching trades'
    );
  });

  it('should sell trade and update trades list', () => {
    const trade: Trade = {
      id: 1,
      timestamp: new Date().toISOString(),
      buyPrice: 30000,
      buyCurrency: 'USD',
      symbol: 'BTC',
      amount: 1,
      limitOrderActive: true,
      stopLossOrderActive: false,
      name: 'Bitcoin',
      sellPrice: undefined,
      sellCurrency: undefined,
      isSold: false,
      limitOrderPrice: undefined,
      stopLossOrderPrice: undefined,
    };

    const trades = [trade];

    tradeServiceMock.getTrades.and.returnValue(of(trades));
    marketServiceMock.fetchCurrentPrice.and.returnValue(of(35000));
    tradeServiceMock.sellCurrency.and.returnValue(of({}));

    component.ngOnInit();
    fixture.detectChanges();

    const sellButton = fixture.debugElement.query(By.css('.btn-primary'));
    sellButton.triggerEventHandler('click', { stopPropagation: () => {} });

    expect(marketServiceMock.fetchCurrentPrice).toHaveBeenCalledWith(
      'Bitcoin',
      'USD'
    );
    expect(tradeServiceMock.sellCurrency).toHaveBeenCalledWith(
      trade.id,
      trade.symbol,
      trade.amount,
      trade.buyCurrency,
      35000,
      trade.name
    );
    expect(tradeServiceMock.getTrades).toHaveBeenCalledTimes(2); // Once in ngOnInit and once after sell
  });

  it('should handle error while selling trade', () => {
    const consoleSpy = spyOn(console, 'error');
    const trade: Trade = {
      id: 1,
      timestamp: new Date().toISOString(),
      buyPrice: 30000,
      buyCurrency: 'USD',
      symbol: 'BTC',
      amount: 1,
      limitOrderActive: true,
      stopLossOrderActive: false,
      name: 'Bitcoin',
      sellPrice: undefined,
      sellCurrency: undefined,
      isSold: false,
      limitOrderPrice: undefined,
      stopLossOrderPrice: undefined,
    };

    const trades = [trade];

    tradeServiceMock.getTrades.and.returnValue(of(trades));
    marketServiceMock.fetchCurrentPrice.and.returnValue(of(35000));
    tradeServiceMock.sellCurrency.and.returnValue(
      throwError('Error selling trade')
    );

    component.ngOnInit();
    fixture.detectChanges();

    const sellButton = fixture.debugElement.query(By.css('.btn-primary'));
    sellButton.triggerEventHandler('click', { stopPropagation: () => {} });

    expect(marketServiceMock.fetchCurrentPrice).toHaveBeenCalledWith(
      'Bitcoin',
      'USD'
    );
    expect(tradeServiceMock.sellCurrency).toHaveBeenCalledWith(
      trade.id,
      trade.symbol,
      trade.amount,
      trade.buyCurrency,
      35000,
      trade.name
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to sell currency:',
      'Error selling trade'
    );
  });

  it('should navigate to trade details on row click', () => {
    const trade: Trade = {
      id: 1,
      timestamp: new Date().toISOString(),
      buyPrice: 30000,
      buyCurrency: 'USD',
      symbol: 'BTC',
      amount: 1,
      limitOrderActive: true,
      stopLossOrderActive: false,
      name: 'Bitcoin',
      sellPrice: undefined,
      sellCurrency: undefined,
      isSold: false,
      limitOrderPrice: undefined,
      stopLossOrderPrice: undefined,
    };

    const trades = [trade];

    tradeServiceMock.getTrades.and.returnValue(of(trades));
    marketServiceMock.fetchCurrentPrice.and.returnValue(of(35000));
    spyOn(router, 'navigate');

    component.ngOnInit();
    fixture.detectChanges();

    const tradeRow = fixture.debugElement.query(By.css('.trade-row'));
    tradeRow.triggerEventHandler('click', null);

    expect(router.navigate).toHaveBeenCalledWith(['/trade/detail', trade.id]);
  });
});
