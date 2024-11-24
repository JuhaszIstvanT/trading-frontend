import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { User } from '../../model/user.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user: User = { username: '', password: '', email: '', debitCardNumber: '' };
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Login');
  }

  onSubmit() {
    this.authService.login(this.user.username, this.user.password).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/wallet']);
        this.errorMessage = '';
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid username or password. Please try again.';
      }
    );
  }
}
