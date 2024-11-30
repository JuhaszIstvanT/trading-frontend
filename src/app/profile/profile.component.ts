import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { User } from '../model/user.model';
import { FollowService } from '../service/follow.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  successMessageProfile: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  userProfile: User = {
    username: '',
    password: '',
    email: '',
    debitCardNumber: '',
  };
  followedTraders: string[] = [];

  constructor(
    private authService: AuthService,
    private followService: FollowService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProfile();
    this.getFollowedTraders();
  }

  getProfile(): void {
    this.authService.getProfile().subscribe(
      (profile) => {
        this.userProfile = profile;
      },
      (error) => {
        console.error('Failed to fetch user profile:', error);
      }
    );
  }

  getFollowedTraders(): void {
    this.followService.getUserId().subscribe((followerId: number) => {
      this.followService.getFollowedTraders(followerId).subscribe(
        (traders: string[]) => {
          this.followedTraders = traders;
        },
        (error) => {
          console.error('Failed to fetch followed traders:', error);
        }
      );
    });
  }

  updatePersonalInfo(): void {
    this.authService
      .updateProfile(this.userProfile.username, this.userProfile.email)
      .subscribe(
        () => {
          this.successMessageProfile = 'Profile updated successfully';
          this.getProfile();
        },
        (error) => {
          console.error('Failed to update personal information:', error);
        }
      );
  }

  resetPassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      console.error('Passwords do not match');
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService
      .resetPassword(this.oldPassword, this.newPassword)
      .subscribe(
        (response) => {
          this.successMessage = response.message;
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.errorMessage = '';
        },
        (error) => {
          console.error('Failed to reset password:', error);
          this.errorMessage = 'Failed to reset password. Please try again.';
        }
      );
  }

  redirectToTrader(traderId: number): void {
    this.router.navigate(['/user', traderId]);
  }
}
