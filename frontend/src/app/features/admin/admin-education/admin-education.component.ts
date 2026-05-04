import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Education } from '../../../shared/models/portfolio.models';

@Component({
  selector: 'app-admin-education',
  imports: [FormsModule],
  templateUrl: './admin-education.component.html',
})
export class AdminEducationComponent {
  portfolio = inject(PortfolioService);
  editing: Education | null = null;

  startNew() { this.editing = { degree: '', org: '', from: '', to: '', note: '' }; }
  startEdit(e: Education) { this.editing = { ...e }; }
  cancel() { this.editing = null; }

  save() {
    if (!this.editing) return;
    const list = this.portfolio.education();
    const idx = list.findIndex(e => e._id === this.editing!._id);
    const updated = idx >= 0
      ? list.map((e, i) => i === idx ? this.editing! : e)
      : [...list, { ...this.editing!, _id: Date.now().toString() }];
    this.portfolio.saveEducation(updated).subscribe({
      error: () => this.portfolio.updateSection('education', updated),
    });
    this.editing = null;
  }

  delete(id: string) {
    if (!confirm('Delete?')) return;
    const updated = this.portfolio.education().filter(e => e._id !== id);
    this.portfolio.saveEducation(updated).subscribe({
      error: () => this.portfolio.updateSection('education', updated),
    });
  }
}
