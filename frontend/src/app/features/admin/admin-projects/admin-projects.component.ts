import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Project } from '../../../shared/models/portfolio.models';

@Component({
  selector: 'app-admin-projects',
  imports: [FormsModule],
  templateUrl: './admin-projects.component.html',
})
export class AdminProjectsComponent {
  portfolio = inject(PortfolioService);
  private toast = inject(ToastrService);
  editing = signal<Project | null>(null);
  saving = signal(false);

  startNew() {
    this.editing.set({
      idx: String(this.portfolio.projects().length + 1).padStart(2, '0'),
      title: '', blurb: '', role: '', year: new Date().getFullYear().toString(),
      stack: [], category: 'Product', featured: false, live: '', repo: '', status: 'In Progress',
    });
  }

  startEdit(p: Project) { this.editing.set({ ...p }); }
  cancel() { this.editing.set(null); }

  addTag(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const val = input.value.trim();
    if (val && !this.editing()!.stack.includes(val)) {
      this.editing.update(p => ({ ...p!, stack: [...p!.stack, val] }));
    }
    input.value = '';
  }

  removeTag(tag: string) {
    this.editing.update(p => ({ ...p!, stack: p!.stack.filter(t => t !== tag) }));
  }

  save() {
    const p = this.editing();
    if (!p) return;
    this.saving.set(true);
    const projects = this.portfolio.projects();
    const idx = projects.findIndex(x => x._id === p._id);
    const updated = idx >= 0
      ? projects.map((x, i) => i === idx ? p : x)
      : [...projects, { ...p, _id: Date.now().toString() }];

    this.portfolio.saveProjects(updated).subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(null);
        this.toast.success('Project saved');
      },
      error: () => {
        this.portfolio.updateSection('projects', updated);
        this.saving.set(false);
        this.editing.set(null);
        this.toast.error('Failed to save project');
      },
    });
  }

  delete(id: string) {
    if (!confirm('Delete this project?')) return;
    const updated = this.portfolio.projects().filter(p => p._id !== id);
    this.portfolio.saveProjects(updated).subscribe({
      next: () => this.toast.success('Project deleted'),
      error: () => {
        this.portfolio.updateSection('projects', updated);
        this.toast.error('Failed to delete project');
      },
    });
  }
}
