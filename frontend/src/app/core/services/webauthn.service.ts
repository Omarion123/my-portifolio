import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, switchMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import {
  startRegistration,
  startAuthentication,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  token: string;
  user: { id: string; email: string };
}

interface LoginOptions extends PublicKeyCredentialRequestOptionsJSON {
  userId: string;
}

export interface PasskeyCredential {
  _id: string;
  deviceName: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class WebAuthnService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private router = inject(Router);
  private api = `${environment.apiUrl}/webauthn`;

  /** Full login flow: fetch options → biometric prompt → verify → store JWT */
  loginWithPasskey(email: string): Observable<AuthResponse> {
    return this.http
      .get<LoginOptions>(`${this.api}/login/options`, { params: { email } })
      .pipe(
        switchMap(options => {
          const { userId, ...passkeyOptions } = options as LoginOptions;
          return from(startAuthentication({ optionsJSON: passkeyOptions as PublicKeyCredentialRequestOptionsJSON })).pipe(
            switchMap(response =>
              this.http.post<AuthResponse>(`${this.api}/login/verify`, { response, userId })
            )
          );
        }),
        tap(res => this.auth.setToken(res.token))
      );
  }

  /** Full registration flow: fetch options → biometric prompt → verify → save */
  registerPasskey(deviceName: string): Observable<{ verified: boolean }> {
    return this.http
      .get<PublicKeyCredentialCreationOptionsJSON>(`${this.api}/register/options`)
      .pipe(
        switchMap(options =>
          from(startRegistration({ optionsJSON: options })).pipe(
            switchMap(response =>
              this.http.post<{ verified: boolean }>(`${this.api}/register/verify`, {
                response,
                deviceName,
              })
            )
          )
        )
      );
  }

  listPasskeys(): Observable<PasskeyCredential[]> {
    return this.http.get<PasskeyCredential[]>(`${this.api}/credentials`);
  }

  deletePasskey(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/credentials/${id}`);
  }
}
