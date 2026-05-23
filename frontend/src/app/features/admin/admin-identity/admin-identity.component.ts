import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Identity } from '../../../shared/models/portfolio.models';

@Component({
  selector: 'app-admin-identity',
  imports: [FormsModule],
  templateUrl: './admin-identity.component.html',
})
export class AdminIdentityComponent {
  portfolio = inject(PortfolioService);
  private toast = inject(ToastrService);

  form = signal<Identity>({ ...this.portfolio.identity() });
  uploading = signal(false);
  saving = signal(false);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading.set(true);
    this.portfolio.uploadImage(file).subscribe({
      next: ({ url }) => {
        this.form.update(f => ({ ...f, profileImage: url }));
        this.uploading.set(false);
        this.toast.success('Image uploaded');
      },
      error: () => {
        this.uploading.set(false);
        this.toast.error('Upload failed. Check your Cloudinary configuration.');
      },
    });
  }

  save() {
    this.saving.set(true);
    this.portfolio.saveIdentity(this.form()).subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success('Profile saved');
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Failed to save profile');
      },
    });
  }
}
