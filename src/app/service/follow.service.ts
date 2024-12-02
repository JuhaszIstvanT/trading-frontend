import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FollowService {
  private apiUrl = `${environment.local}/Follow`;

  constructor(private http: HttpClient) {}

  followTrader(followerId: number, followedTraderId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const body = { followerId, followedTraderId };
    return this.http.post<any>(`${this.apiUrl}/follow`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  unfollowTrader(
    followerId: number,
    followedTraderId: number
  ): Observable<any> {
    const token = localStorage.getItem('token');
    const body = { followerId, followedTraderId };
    return this.http.post<any>(`${this.apiUrl}/unfollow`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getFollowedTraders(followerId: number): Observable<string[]> {
    const token = localStorage.getItem('token');
    return this.http.get<string[]>(
      `${this.apiUrl}/followed-traders/${followerId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  isFollowing(
    followerId: number,
    followedTraderId: number
  ): Observable<boolean> {
    const token = localStorage.getItem('token');
    return this.http.get<boolean>(`${this.apiUrl}/is-following`, {
      params: {
        followerId: followerId.toString(),
        followedTraderId: followedTraderId.toString(),
      },
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getUserId(): Observable<number> {
    const token = localStorage.getItem('token');
    return this.http.get<number>(`${this.apiUrl}/userId`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
