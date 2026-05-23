import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Experience } from '../../../shared/models/portfolio.models';

@Component({
  selector: 'app-admin-experience',
  imports: [FormsModule],
  templateUrl: './admin-experience.component.html',
})
export class AdminExperienceComponent {
  portfolio = inject(PortfolioService);
  private toast = inject(ToastrService);
  editing: Experience | null = null;

  startNew() {
    this.editing = { role: '', org: '', from: '', to: 'Present', where: '', summary: '', bullets: [] };
  }

  startEdit(e: Experience) { this.editing = { ...e, bullets: [...e.bullets] }; }
  cancel() { this.editing = null; }

  addBullet() { this.editing!.bullets.push(''); }
  removeBullet(i: number) { this.editing!.bullets.splice(i, 1); }
  trackByIndex(i: number) { return i; }

  save() {
    if (!this.editing) return;
    const list = this.portfolio.experience();
    const idx = list.findIndex(e => e._id === this.editing!._id);
    const updated = idx >= 0
      ? list.map((e, i) => i === idx ? this.editing! : e)
      : [...list, { ...this.editing!, _id: Date.now().toString() }];
    this.portfolio.saveExperience(updated).subscribe({
      next: () => this.toast.success('Experience saved'),
      error: () => {
        this.portfolio.updateSection('experience', updated);
        this.toast.error('Failed to save experience');
      },
    });
    this.editing = null;
  }

  delete(id: string) {
    if (!confirm('Delete this entry?')) return;
    const updated = this.portfolio.experience().filter(e => e._id !== id);
    this.portfolio.saveExperience(updated).subscribe({
      next: () => this.toast.success('Entry deleted'),
      error: () => {
        this.portfolio.updateSection('experience', updated);
        this.toast.error('Failed to delete entry');
      },
    });
  }
}
