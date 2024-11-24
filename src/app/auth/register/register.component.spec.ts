import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message when form is invalid', () => {
    component.user.email = 'invalid-email';
    component.user.password = 'sa';

    component.onSubmit();

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Email must be a valid email address.');
    component.user.email = 'valid@example.com';
    component.onSubmit();
    fixture.detectChanges();
    expect(component.errorMessage).toBe(
      'Password must be at least 3 characters long and contain at least one lowercase letter.'
    );
  });

  it('should display error message with duplicate username', () => {
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

    component.onSubmit();

    fixture.detectChanges();

    expect(authService.register).toHaveBeenCalledWith(
      'duplicateUser',
      'Valid123',
      'duplicate@example.com',
      "379912550298789"
    );
    expect(component.errorMessage).toBe('Username is already taken.');
  });

  it('should navigate to wallet on successful registration', () => {
    const response = { token: '12345' };
    authService.register.and.returnValue(of(response));

    component.user.username = 'newUser';
    component.user.email = 'newuser@example.com';
    component.user.password = 'ValidPassword';

    component.onSubmit();

    fixture.detectChanges();

    expect(authService.register).toHaveBeenCalledWith(
      'newUser',
      'ValidPassword',
      'newuser@example.com',
      "379912550298789"
    );
    expect(localStorage.getItem('token')).toBe('12345');
    expect(router.navigate).toHaveBeenCalledWith(['/wallet']);
    expect(component.errorMessage).toBe('');
  });
});
