import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { LoginComponent } from './login.component';
import { Title } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let titleService: jasmine.SpyObj<Title>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Title, useValue: titleServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    titleService = TestBed.inject(Title) as jasmine.SpyObj<Title>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title on initialization', () => {
    component.ngOnInit();
    expect(titleService.setTitle).toHaveBeenCalledWith('Login');
  });

  it('should display an error on invalid login credentials', () => {
    const errorResponse = { status: 401 };
    authService.login.and.returnValue(throwError(() => errorResponse));

    component.user.username = 'invalidUser';
    component.user.password = 'InvalidPassword';

    component.onSubmit();
    fixture.detectChanges();

    expect(authService.login).toHaveBeenCalledWith('invalidUser', 'InvalidPassword');
    expect(component.errorMessage).toBe('Invalid username or password. Please try again.');
  });

  it('should navigate to wallet on successful login', () => {
    const response = { token: '12345' };
    authService.login.and.returnValue(of(response));

    component.user.username = 'validUser';
    component.user.password = 'ValidPassword';

    component.onSubmit();
    fixture.detectChanges();

    expect(authService.login).toHaveBeenCalledWith('validUser', 'ValidPassword');
    expect(localStorage.getItem('token')).toBe('12345');
    expect(router.navigate).toHaveBeenCalledWith(['/wallet']);
    expect(component.errorMessage).toBe('');
  });

  it('should clear error message after successful login', () => {
    const response = { token: '12345' };
    authService.login.and.returnValue(of(response));

    component.errorMessage = 'Some error occurred';
    component.user.username = 'validUser';
    component.user.password = 'ValidPassword';

    component.onSubmit();
    fixture.detectChanges();

    expect(authService.login).toHaveBeenCalled();
    expect(component.errorMessage).toBe('');
  });

  it('should render the login form', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    const usernameInput = compiled.querySelector('input#username') as HTMLInputElement;
    const passwordInput = compiled.querySelector('input#password') as HTMLInputElement;
    const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(submitButton.textContent).toContain('Login');
  });
});
