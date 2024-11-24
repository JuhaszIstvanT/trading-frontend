import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../service/auth.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(localStorage, 'removeItem');
    fixture.detectChanges();
  });

  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  it('should render navigation links', () => {
    const compiled = fixture.nativeElement;
    const navLinks = compiled.querySelectorAll('a.nav-link');

    expect(navLinks.length).toBe(9);

    expect(navLinks[0].textContent).toContain('Home');
    expect(navLinks[1].textContent).toContain('Dashboard');
    expect(navLinks[2].textContent).toContain('Market');
    expect(navLinks[3].textContent).toContain('Blocks');
    expect(navLinks[4].textContent).toContain('Watchlist');
    expect(navLinks[5].textContent).toContain('Profile');
    expect(navLinks[6].textContent).toContain('Leaderboard');
    expect(navLinks[7].textContent).toContain('Login');
    expect(navLinks[8].textContent).toContain('Logout');
  });

  it('should call logout on logout button click and navigate to login', () => {
    authServiceMock.logout.and.returnValue(of({}));
    spyOn(router, 'navigate');

    const logoutButton = fixture.debugElement
      .queryAll(By.css('a.nav-link'))
      .find((el) => el.nativeElement.textContent.trim() === 'Logout');
    logoutButton.triggerEventHandler('click', null);

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle error on logout failure', () => {
    const consoleSpy = spyOn(console, 'log');
    authServiceMock.logout.and.returnValue(throwError('Logout failed'));

    const logoutButton = fixture.debugElement
      .queryAll(By.css('a.nav-link'))
      .find((el) => el.nativeElement.textContent.trim() === 'Logout');
    logoutButton.triggerEventHandler('click', null);

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Logout failed:', 'Logout failed');
  });
});
