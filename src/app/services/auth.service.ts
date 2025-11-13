import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {jwtDecode} from 'jwt-decode';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface JwtPayload {
  exp: number;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();
  private refreshTimer?: any;

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(res => this.setSession(res)),
        catchError(err => {
          console.error('Login failed', err);
          alert('Login failed');
          return throwError(() => err);
        })
      );
  }

  private setSession(res: AuthResponse) {
    localStorage.setItem('access_token', res.accessToken);
    localStorage.setItem('refresh_token', res.refreshToken);
    this.userSubject.next(jwtDecode(res.accessToken));
    this.startRefreshTimer();
  }

  private loadToken() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        this.userSubject.next(jwtDecode(token));
        this.startRefreshTimer();
      } catch (e) {
        this.logout();
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAdmin(): boolean {
    const user = this.userSubject.value;
    return user?.role === 'Admin';
  }

  private startRefreshTimer() {
    this.stopRefreshTimer();
    const token = this.getToken();
    if (!token) return;

    const payload = jwtDecode<JwtPayload>(token);
    const expiresIn = payload.exp * 1000 - Date.now();
    const refreshAt = expiresIn - 60_000; // 1 min before expiry

    if (refreshAt > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshToken().subscribe();
      }, refreshAt);
    } else {
      this.refreshToken().subscribe();
    }
  }

  private stopRefreshTimer() {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, {
      accessToken: this.getToken(),
      refreshToken
    }).pipe(
      tap(res => this.setSession(res)),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  logout() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken){
    this.http.post(`${environment.apiUrl}/auth/revoke`, { refreshToken }).subscribe();
    localStorage.clear();
    }
    this.userSubject.next(null);
    this.stopRefreshTimer();
  }
}