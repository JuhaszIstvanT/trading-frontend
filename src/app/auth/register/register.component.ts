import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { User } from '../../model/user.model';
import { Title } from '@angular/platform-browser';
import { WalletService } from '../../service/wallet.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  user: User = { username: '', password: '', email: '', debitCardNumber: '' };
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private titleService: Title,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Register');
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.authService
        .register(
          this.user.username,
          this.user.password,
          this.user.email,
          this.user.debitCardNumber
        )
        .subscribe(
          (response) => {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/wallet']);
            this.errorMessage = '';
          },
          (error) => {
            console.error('Registration failed:', error);
            this.handleError(error);
          }
        );
    }
  }

  isFormValid(): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z]).{3,}$/;
    if (!emailPattern.test(this.user.email)) {
      this.errorMessage = 'Email must be a valid email address.';
      return false;
    }
    if (!passwordPattern.test(this.user.password)) {
      this.errorMessage =
        'Password must be at least 3 characters long and contain at least one lowercase letter.';
      return false;
    }
    if (!this.walletService.isValidCardNumber(this.user.debitCardNumber)) {
      this.errorMessage = 'Debit card number is invalid.';
      return false;
    }
    return true;
  }

  handleError(error: any): void {
    if (error.status === 400 && error.error instanceof Array) {
      const duplicateUsernameError = error.error.find(
        (err: any) => err.code === 'DuplicateUserName'
      );
      if (duplicateUsernameError) {
        this.errorMessage = duplicateUsernameError.description;
      } else {
        this.errorMessage =
          'Registration failed. Please check your details and try again.';
      }
    } else {
      this.errorMessage =
        'Registration failed. Please check your details and try again.';
    }
  }
}
