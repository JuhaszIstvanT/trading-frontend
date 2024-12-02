import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CurrencyConverterComponent } from './currency-converter.component';
import { TradeService } from '../service/trade.service';
import { MarketService } from '../service/market.service';

describe('CurrencyConverterComponent', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;
  let tradeService: jasmine.SpyObj<TradeService>;
  let marketService: jasmine.SpyObj<MarketService>;
  let routeMock: any;

  beforeEach(async () => {
    tradeService = jasmine.createSpyObj('TradeService', ['buyCurrency']);
    marketService = jasmine.createSpyObj('MarketService', [
      'fetchTickerData',
      'fetchSpecificTickerData',
    ]);
    routeMock = {
      paramMap: of({ get: () => 'bitcoin' }),
    };

    await TestBed.configureTestingModule({
      declarations: [CurrencyConverterComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: TradeService, useValue: tradeService },
        { provide: MarketService, useValue: marketService },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle amount change and update converted amount', () => {
    component.selectedCurrencyValue = 50000;
    component.onAmountChange({ target: { value: '2' } });

    expect(component.selectedAmount).toBe(2);
    expect(component.convertedAmount).toBe(100000);
  });

  it('should show error for negative amount', () => {
    component.onAmountChange({ target: { value: '-5' } });

    expect(component.selectedAmount).toBe(0);
    expect(component.amountError).toBe('Amount must be a positive number');
  });


  it('should perform a trade successfully', () => {
    tradeService.buyCurrency.and.returnValue(of({ message: 'Trade successful' }));

    component.selectedCurrency = 'bitcoin';
    component.selectedCurrencySymbol = 'BTC';
    component.selectedAmount = 1;
    component.convertedAmount = 50000;

    component.onTrade();

    expect(tradeService.buyCurrency).toHaveBeenCalledWith(
      -1,
      'BTC',
      1,
      'usd',
      50000,
      'bitcoin'
    );
    expect(component.successMessage).toBe('Trade successful');
    expect(component.errorMessage).toBe('');
  });

  it('should show an error message when trade fails', () => {
    tradeService.buyCurrency.and.returnValue(throwError('Trade error'));

    component.selectedCurrency = 'bitcoin';
    component.selectedCurrencySymbol = 'BTC';
    component.selectedAmount = 1;
    component.convertedAmount = 50000;

    component.onTrade();

    expect(tradeService.buyCurrency).toHaveBeenCalledWith(
      -1,
      'BTC',
      1,
      'usd',
      50000,
      'bitcoin'
    );
    expect(component.errorMessage).toBe('Failed to make trade.');
    expect(component.successMessage).toBe('');
  });

  it('should handle errors during currency conversion fetch', () => {
    marketService.fetchTickerData.and.returnValue(throwError('Currency error'));

    component.convertCurrency();

    expect(marketService.fetchTickerData).toHaveBeenCalled();
    expect(component.selectedCurrencyValue).toBe(0);
    expect(component.convertedAmount).toBe(0);
  });
});
