import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  token: string;
  user: { id: string; email: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _token = signal<string | null>(localStorage.getItem('auth_token'));
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        this._token.set(res.token);
        localStorage.setItem('auth_token', res.token);
      })
    );
  }

  logout() {
    this._token.set(null);
    localStorage.removeItem('auth_token');
    this.router.navigate(['/auth/login']);
  }

  getToken() {
    return this._token();
  }
}
