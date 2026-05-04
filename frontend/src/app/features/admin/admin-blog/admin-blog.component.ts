import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { BlogPost } from '../../../shared/models/portfolio.models';

@Component({
  selector: 'app-admin-blog',
  imports: [FormsModule],
  templateUrl: './admin-blog.component.html',
})
export class AdminBlogComponent {
  portfolio = inject(PortfolioService);
  editing: BlogPost | null = null;

  startNew() {
    this.editing = { title: '', excerpt: '', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), readMin: 5, tag: 'General', content: '', published: false };
  }

  startEdit(p: BlogPost) { this.editing = { ...p }; }
  cancel() { this.editing = null; }

  save() {
    if (!this.editing) return;
    const list = this.portfolio.posts();
    const idx = list.findIndex(p => p._id === this.editing!._id);
    const updated = idx >= 0
      ? list.map((p, i) => i === idx ? this.editing! : p)
      : [...list, { ...this.editing!, _id: Date.now().toString() }];
    this.portfolio.savePosts(updated).subscribe({
      error: () => this.portfolio.updateSection('posts', updated),
    });
    this.editing = null;
  }

  delete(id: string) {
    if (!confirm('Delete post?')) return;
    const updated = this.portfolio.posts().filter(p => p._id !== id);
    this.portfolio.savePosts(updated).subscribe({
      error: () => this.portfolio.updateSection('posts', updated),
    });
  }
}
