import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { WalletService } from '../../service/wallet.service';
import { DepositModalComponent } from './deposit-modal.component';

describe('DepositModalComponent', () => {
  let component: DepositModalComponent;
  let fixture: ComponentFixture<DepositModalComponent>;
  let walletService: jasmine.SpyObj<WalletService>;

  beforeEach(async () => {
    const walletServiceSpy = jasmine.createSpyObj('WalletService', [
      'isValidCardNumber',
      'depositFunds',
    ]);

    await TestBed.configureTestingModule({
      declarations: [DepositModalComponent],
      imports: [FormsModule],
      providers: [{ provide: WalletService, useValue: walletServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DepositModalComponent);
    component = fixture.componentInstance;
    walletService = TestBed.inject(
      WalletService
    ) as jasmine.SpyObj<WalletService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

//   it('should display error message when card number is invalid', () => {
//     walletService.isValidCardNumber.and.returnValue(false);
//     component.cardNumber = '1234567';
//     component.submitDeposit();

//     fixture.detectChanges();

//     expect(walletService.isValidCardNumber).toHaveBeenCalledWith(
//       '1234567'
//     );
//     expect(component.isCardNumberValid).toBe(false);
//   });

//   it('should call depositFunds and show success message on successful deposit', () => {
//     walletService.isValidCardNumber.and.returnValue(true);
//     walletService.depositFunds.and.returnValue(
//       of({ message: 'Deposit successful' })
//     );

//     component.cardNumber = '379912550298789';
//     component.currency = 'USD';
//     component.depositAmount = 100;

//     component.submitDeposit();
//     fixture.detectChanges();

//     expect(walletService.depositFunds).toHaveBeenCalledWith('USD', 100);
//     expect(component.successMessage).toBe('Deposit was successful!');
//     expect(component.errorMessage).toBe('');
//   });

//   it('should call depositFunds and show error message on failed deposit', () => {
//     walletService.isValidCardNumber.and.returnValue(true);
//     walletService.depositFunds.and.returnValue(
//       throwError(() => new Error('Deposit failed'))
//     );

//     component.cardNumber = '379912550298789';
//     component.currency = 'USD';
//     component.depositAmount = 100;

//     component.submitDeposit();
//     fixture.detectChanges();

//     expect(walletService.depositFunds).toHaveBeenCalledWith('USD', 100);
//     expect(component.successMessage).toBe('');
//     expect(component.errorMessage).toBe('Deposit failed. Please try again.');
//   });

  it('should emit close event on closeModal', () => {
    spyOn(component.close, 'emit');
    component.closeModal();
    expect(component.close.emit).toHaveBeenCalled();
  });
});
