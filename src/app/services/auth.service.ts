import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

interface AuthResponse {
  accessToken: string;
}

interface JwtPayload {
  email: string;
  role: string;
  exp: number;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<JwtPayload | null>(null);
  public user$ = this.userSubject.asObservable();
  private isRefreshing = false;

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(res => this.updateToken(res.accessToken)),
        catchError(err => {
          console.error('Login failed:', err);
          return throwError(() => err);
        })
      );
  }

  private updateToken(accessToken: string) {
    localStorage.setItem('access_token', accessToken);
    try {
      const payload = jwtDecode<JwtPayload>(accessToken);
      this.userSubject.next(payload);
    } catch {
      this.logout();
    }
  }

  private loadToken() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = jwtDecode<JwtPayload>(token);
        if (payload.exp * 1000 > Date.now()) {
          this.userSubject.next(payload);
        } else {
          this.logout();
        }
      } catch {
        this.logout();
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }

  isAdmin(): boolean {
    return this.userSubject.value?.role === 'Admin';
  }

  isCustomer(): boolean {
    return this.userSubject.value?.role === 'Customer';
  }

  getUserEmail(): string | null {
    return this.userSubject.value?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? null;
  }

  getUserId(): number | null {
    const id = this.userSubject.value?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    return id ? parseInt(id, 10) : null;
  }

  refreshToken(): Observable<{ accessToken: string }> {
    if (this.isRefreshing) {
      return new Observable(observer => {
        const check = setInterval(() => {
          if (!this.isRefreshing) {
            clearInterval(check);
            observer.next({ accessToken: this.getToken()! });
            observer.complete();
          }
        }, 50);
      });
    }

    this.isRefreshing = true;
    return this.http.post<{ accessToken: string }>(`${environment.apiUrl}/auth/refresh`, {}, { 
      withCredentials: true 
    })
      .pipe(
        tap(res => {
          this.updateToken(res.accessToken);
          this.isRefreshing = false;
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.logout();
          return throwError(() => err);
        })
      );
  }

  logout() {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({
      error: () => console.warn('Already logged out')
    });
    localStorage.removeItem('access_token');
    this.userSubject.next(null);
  }
}