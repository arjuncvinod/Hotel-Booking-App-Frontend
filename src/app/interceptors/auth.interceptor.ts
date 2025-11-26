import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();


  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(req).pipe(
    catchError(err => {

      if (err.status === 401 && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/login')) {
        
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap(res => {
              isRefreshing = false;
              const newToken = res.accessToken;
              refreshTokenSubject.next(newToken);
              console.log(res);
              return next(req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              }));
            }),
            catchError(refreshErr => {
              isRefreshing = false;
              authService.logout();
              return throwError(() => refreshErr);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter(token => token !== null), 
            take(1),
            switchMap(token => {
              return next(req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
              }));
            }),
            catchError(waitErr => {
              return throwError(() => waitErr);
            })
          );
        }
      }

      return throwError(() => err);
    })
  );
};