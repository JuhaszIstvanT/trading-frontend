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

  it('should emit close event on closeModal', () => {
    spyOn(component.close, 'emit');
    component.closeModal();
    expect(component.close.emit).toHaveBeenCalled();
  });
});
