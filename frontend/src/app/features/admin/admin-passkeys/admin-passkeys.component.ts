import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WebAuthnService, PasskeyCredential } from '../../../core/services/webauthn.service';

@Component({
  selector: 'app-admin-passkeys',
  imports: [FormsModule],
  templateUrl: './admin-passkeys.component.html',
})
export class AdminPasskeysComponent implements OnInit {
  private webAuthn = inject(WebAuthnService);
  private toast = inject(ToastrService);

  passkeys = signal<PasskeyCredential[]>([]);
  deviceName = signal('My device');
  registering = signal(false);
  loading = signal(false);

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.webAuthn.listPasskeys().subscribe({
      next: list => { this.passkeys.set(list); this.loading.set(false); },
      error: () => { this.toast.error('Could not load passkeys'); this.loading.set(false); },
    });
  }

  register() {
    this.registering.set(true);
    this.webAuthn.registerPasskey(this.deviceName()).subscribe({
      next: () => {
        this.toast.success('Fingerprint registered successfully');
        this.deviceName.set('My device');
        this.registering.set(false);
        this.load();
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Registration failed or was cancelled.';
        this.toast.error(msg);
        this.registering.set(false);
      },
    });
  }

  delete(id: string) {
    if (!confirm('Remove this passkey? You will no longer be able to use it to log in.')) return;
    this.webAuthn.deletePasskey(id).subscribe({
      next: () => {
        this.toast.success('Passkey removed');
        this.passkeys.update(list => list.filter(p => p._id !== id));
      },
      error: () => this.toast.error('Failed to remove passkey'),
    });
  }

  formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
