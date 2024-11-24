import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionHistoryComponent } from './transaction-history.component';
import { WalletService } from '../service/wallet.service';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TransactionHistoryComponent', () => {
  let component: TransactionHistoryComponent;
  let fixture: ComponentFixture<TransactionHistoryComponent>;
  let mockWalletService: jasmine.SpyObj<WalletService>;

  const mockTransactions = [
    {
      date: '2024-05-20T00:00:00Z',
      type: 'Deposit',
      currency: 'USD',
      amount: 100,
    },
    {
      date: '2024-05-21T00:00:00Z',
      type: 'Withdrawal',
      currency: 'USD',
      amount: 50,
    },
  ];

  beforeEach(async () => {
    mockWalletService = jasmine.createSpyObj(
      'WalletService',
      ['getTransactionHistory'],
      {
        transactionSuccess: new Subject<void>(),
      }
    );

    await TestBed.configureTestingModule({
      declarations: [TransactionHistoryComponent],
      providers: [{ provide: WalletService, useValue: mockWalletService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionHistoryComponent);
    component = fixture.componentInstance;
    mockWalletService.getTransactionHistory.and.returnValue(
      of(mockTransactions)
    );
    fixture.detectChanges(); // This triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch transactions and initialize pagination', () => {
    component.ngOnInit();
    fixture.detectChanges();  

    expect(mockWalletService.getTransactionHistory).toHaveBeenCalled();
    expect(component.transactions).toEqual(mockTransactions);
    expect(component.filteredTransactions.length).toBe(2);
    expect(component.paginatedTransactions.length).toBe(2);
  });

  it('should sort transactions by date', () => {
    component.sortTransactionsByDate(component.filteredTransactions);
    fixture.detectChanges();

    expect(component.filteredTransactions[0].date).toBe('2024-05-20T00:00:00Z');
    expect(component.filteredTransactions[1].date).toBe('2024-05-21T00:00:00Z');
  });

  it('should sort transactions by amount', () => {
    component.sortTransactionsByAmount(component.filteredTransactions);
    fixture.detectChanges();

    expect(component.filteredTransactions[0].amount).toBe(100);
    expect(component.filteredTransactions[1].amount).toBe(50);
  });

  it('should filter transactions by type', () => {
    component.selectedType = 'Deposit';
    component.filterTransactionsByType();
    fixture.detectChanges();

    expect(component.filteredTransactions.length).toBe(1);
    expect(component.filteredTransactions[0].type).toBe('Deposit');
  });

  it('should paginate transactions', () => {
    component.itemsPerPage = 1;
    component.paginateTransactions();
    fixture.detectChanges();

    expect(component.totalPages).toBe(2);
    expect(component.paginatedTransactions.length).toBe(1);
  });

  it('should change page', () => {
    component.itemsPerPage = 1;
    component.paginateTransactions();
    fixture.detectChanges();

    component.changePage(2);
    fixture.detectChanges();

    expect(component.currentPage).toBe(2);
    expect(component.paginatedTransactions.length).toBe(1);
    expect(component.paginatedTransactions[0].amount).toBe(100);
  });
});
