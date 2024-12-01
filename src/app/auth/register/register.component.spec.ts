import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { RegisterComponent } from './register.component';
import { Title } from '@angular/platform-browser';
import { WalletService } from '../../service/wallet.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let titleService: jasmine.SpyObj<Title>;
  let walletService: jasmine.SpyObj<WalletService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);
    const walletServiceSpy = jasmine.createSpyObj('WalletService', ['isValidCardNumber']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Title, useValue: titleServiceSpy },
        { provide: WalletService, useValue: walletServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    titleService = TestBed.inject(Title) as jasmine.SpyObj<Title>;
    walletService = TestBed.inject(WalletService) as jasmine.SpyObj<WalletService>;

    // Default setup for WalletService
    walletService.isValidCardNumber.and.returnValue(true);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title on initialization', () => {
    component.ngOnInit();
    expect(titleService.setTitle).toHaveBeenCalledWith('Register');
  });

  it('should display an error if the email is invalid', () => {
    component.user.email = 'invalid-email';
    component.user.password = 'Valid123';
    component.user.debitCardNumber = '1234567890123456';

    component.onSubmit();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Email must be a valid email address.');
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should display an error if the password is invalid', () => {
    component.user.email = 'valid@example.com';
    component.user.password = '12';
    component.user.debitCardNumber = '1234567890123456';

    component.onSubmit();
    fixture.detectChanges();

    expect(component.errorMessage).toBe(
      'Password must be at least 3 characters long and contain at least one lowercase letter.'
    );
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should display an error if the debit card number is invalid', () => {
    walletService.isValidCardNumber.and.returnValue(false);

    component.user.email = 'valid@example.com';
    component.user.password = 'Valid123';
    component.user.debitCardNumber = 'invalid-card';

    component.onSubmit();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Debit card number is invalid.');
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should handle duplicate username error', () => {
    const errorResponse = {
      status: 400,
      error: [
        {
          code: 'DuplicateUserName',
          description: 'Username is already taken.',
        },
      ],
    };
    authService.register.and.returnValue(throwError(() => errorResponse));

    component.user.username = 'duplicateUser';
    component.user.email = 'duplicate@example.com';
    component.user.password = 'Valid123';
    component.user.debitCardNumber = '1234567890123456';

    component.onSubmit();
    fixture.detectChanges();

    expect(authService.register).toHaveBeenCalledWith(
      'duplicateUser',
      'Valid123',
      'duplicate@example.com',
      '1234567890123456'
    );
    expect(component.errorMessage).toBe('Username is already taken.');
  });

  it('should navigate to wallet on successful registration', () => {
    const response = { token: '12345' };
    authService.register.and.returnValue(of(response));

    component.user.username = 'newUser';
    component.user.email = 'newuser@example.com';
    component.user.password = 'ValidPassword';
    component.user.debitCardNumber = '1234567890123456';

    component.onSubmit();
    fixture.detectChanges();

    expect(authService.register).toHaveBeenCalledWith(
      'newUser',
      'ValidPassword',
      'newuser@example.com',
      '1234567890123456'
    );
    expect(localStorage.getItem('token')).toBe('12345');
    expect(router.navigate).toHaveBeenCalledWith(['/wallet']);
    expect(component.errorMessage).toBe('');
  });

  it('should display a generic error message on server error', () => {
    const errorResponse = {
      status: 500,
    };
    authService.register.and.returnValue(throwError(() => errorResponse));

    component.user.username = 'testUser';
    component.user.email = 'test@example.com';
    component.user.password = 'ValidPassword';
    component.user.debitCardNumber = '1234567890123456';

    component.onSubmit();
    fixture.detectChanges();

    expect(authService.register).toHaveBeenCalled();
    expect(component.errorMessage).toBe(
      'Registration failed. Please check your details and try again.'
    );
  });
});
