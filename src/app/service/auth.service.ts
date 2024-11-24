import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient) {}

  register(username: string, password: string, email: string, debitCardNumber: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      email,
      username,
      password,
      debitCardNumber
    });
  }

  login(usernameOrEmail: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      usernameOrEmail,
      password,
    });
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {});
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.get<any>(`${this.apiUrl}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateProfile(username: string, email: string): Observable<any> {
    const token = localStorage.getItem('token');

    const payload = {
      Username: username,
      Email: email,
    };

    return this.http.put<any>(`${this.apiUrl}/profile`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  resetPassword(oldPassword: string, newPassword: string): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.put<any>(
      `${this.apiUrl}/reset-password`,
      { oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
}
