import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CurrencyConverterComponent } from './currency-converter.component';
import { TradeService } from '../service/trade.service';

describe('CurrencyConverterComponent', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;
  let httpTestingController: HttpTestingController;
  let tradeServiceMock: any;
  let routeMock: any;

  beforeEach(async () => {
    tradeServiceMock = jasmine.createSpyObj('TradeService', ['buyCurrency']);
    routeMock = {
      paramMap: of({ get: () => 'bitcoin' }),
    };

    await TestBed.configureTestingModule({
      declarations: [CurrencyConverterComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: TradeService, useValue: tradeServiceMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    const req = httpTestingController.expectOne(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&apiKey=CG-JzHexe4U5tYy5YeiK8ExpL8y'
    );
    expect(req.request.method).toEqual('GET');
    req.flush({ bitcoin: { usd: 50000 } });
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should initialize and fetch initial currency conversion rate', () => {
    expect(component.selectedCurrency).toBe('bitcoin');
    expect(component.targetCurrency).toBe('usd');
    expect(component.selectedCurrencyValue).toBe(50000);
    expect(component.convertedAmount).toBe(50000);
  });

  it('should handle amount change and update converted amount', () => {
    component.selectedCurrencyValue = 50000;
    component.onAmountChange({ target: { value: '2' } });

    expect(component.selectedAmount).toBe(2);
    expect(component.convertedAmount).toBe(100000);
  });

  it('should handle currency change and update conversion rate', () => {
    component.onCurrencyChange({ target: { value: 'eur' } });

    const req = httpTestingController.expectOne(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur&apiKey=CG-JzHexe4U5tYy5YeiK8ExpL8y'
    );
    expect(req.request.method).toEqual('GET');
    req.flush({ bitcoin: { eur: 45000 } });

    expect(component.targetCurrency).toBe('eur');
    expect(component.selectedCurrencyValue).toBe(45000);
    expect(component.convertedAmount).toBe(45000);
  });

  it('should perform trade and handle response', () => {
    tradeServiceMock.buyCurrency.and.returnValue(of({}));
    spyOn(console, 'log');

    component.onTrade();

    expect(tradeServiceMock.buyCurrency).toHaveBeenCalledWith(
      -1,
      'bitcoin',
      1,
      'usd',
      50000,
      'bitcoin'
    );
    expect(console.log).toHaveBeenCalledWith('Trade successful');
  });

  it('should handle error during trade', () => {
    tradeServiceMock.buyCurrency.and.returnValue(throwError('Trade error'));
    spyOn(console, 'error');

    component.onTrade();

    expect(tradeServiceMock.buyCurrency).toHaveBeenCalledWith(
      -1,
      'bitcoin',
      1,
      'usd',
      50000,
      'bitcoin'
    );
    expect(console.error).toHaveBeenCalledWith(
      'Failed to make trade:',
      'Trade error'
    );
  });

  it('should handle error during currency conversion fetch', () => {
    const consoleSpy = spyOn(console, 'error');
    component.convertCurrency();
    const req = httpTestingController.expectOne(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&apiKey=CG-JzHexe4U5tYy5YeiK8ExpL8y'
    );
    req.flush('Error fetching currency conversion', {
      status: 500,
      statusText: 'Server Error',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching currency conversion:',
      jasmine.any(Object)
    );
  });
});
