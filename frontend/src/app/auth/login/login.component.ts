import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { WebAuthnService } from '../../core/services/webauthn.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private webAuthn = inject(WebAuthnService);
  private router = inject(Router);
  private toast = inject(ToastrService);

  email = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);
  passkeyLoading = signal(false);

  submit() {
    if (!this.email() || !this.password()) return;
    this.loading.set(true);
    this.error.set('');

    this.auth.login(this.email(), this.password()).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: () => {
        this.error.set('Invalid email or password.');
        this.loading.set(false);
      },
    });
  }

  loginWithPasskey() {
    if (!this.email()) {
      this.error.set('Enter your email first, then tap the fingerprint button.');
      return;
    }
    this.passkeyLoading.set(true);
    this.error.set('');

    this.webAuthn.loginWithPasskey(this.email()).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: (err) => {
        const msg = err?.error?.message ?? 'Passkey login failed.';
        this.error.set(msg);
        this.passkeyLoading.set(false);
      },
    });
  }
}
