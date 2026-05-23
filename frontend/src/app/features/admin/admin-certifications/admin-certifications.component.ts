import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Certification } from '../../../shared/models/portfolio.models';

@Component({
  selector: 'app-admin-certifications',
  imports: [FormsModule],
  templateUrl: './admin-certifications.component.html',
})
export class AdminCertificationsComponent {
  portfolio = inject(PortfolioService);
  private toast = inject(ToastrService);
  editing: Certification | null = null;

  startNew() { this.editing = { name: '', org: '', year: '' }; }
  startEdit(c: Certification) { this.editing = { ...c }; }
  cancel() { this.editing = null; }

  save() {
    if (!this.editing) return;
    const list = this.portfolio.certifications();
    const idx = list.findIndex(c => c._id === this.editing!._id);
    const updated = idx >= 0
      ? list.map((c, i) => i === idx ? this.editing! : c)
      : [...list, { ...this.editing!, _id: Date.now().toString() }];
    this.portfolio.saveCertifications(updated).subscribe({
      next: () => this.toast.success('Certification saved'),
      error: () => {
        this.portfolio.updateSection('certifications', updated);
        this.toast.error('Failed to save certification');
      },
    });
    this.editing = null;
  }

  delete(id: string) {
    if (!confirm('Delete?')) return;
    const updated = this.portfolio.certifications().filter(c => c._id !== id);
    this.portfolio.saveCertifications(updated).subscribe({
      next: () => this.toast.success('Certification deleted'),
      error: () => {
        this.portfolio.updateSection('certifications', updated);
        this.toast.error('Failed to delete certification');
      },
    });
  }
}
