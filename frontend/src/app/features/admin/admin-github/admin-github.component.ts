import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';

interface GithubAccount {
  _id: string;
  username: string;
  label: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin-github',
  imports: [FormsModule],
  templateUrl: './admin-github.component.html',
})
export class AdminGithubComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastrService);
  private api = `${environment.apiUrl}/github`;

  accounts = signal<GithubAccount[]>([]);
  loading = signal(false);
  adding = signal(false);

  form = signal({ username: '', accessToken: '', label: '' });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.http.get<GithubAccount[]>(`${this.api}/accounts`).subscribe({
      next: list => { this.accounts.set(list); this.loading.set(false); },
      error: () => { this.toast.error('Could not load accounts'); this.loading.set(false); },
    });
  }

  add() {
    const { username, accessToken, label } = this.form();
    if (!username || !accessToken) {
      this.toast.error('Username and token are required');
      return;
    }
    this.adding.set(true);
    this.http.post<GithubAccount>(`${this.api}/accounts`, { username, accessToken, label: label || username }).subscribe({
      next: account => {
        this.accounts.update(list => [...list, account]);
        this.form.set({ username: '', accessToken: '', label: '' });
        this.adding.set(false);
        this.toast.success(`${account.username} added`);
      },
      error: (err) => {
        this.toast.error(err?.error?.message ?? 'Failed to add account');
        this.adding.set(false);
      },
    });
  }

  delete(id: string, username: string) {
    if (!confirm(`Remove @${username}?`)) return;
    this.http.delete(`${this.api}/accounts/${id}`).subscribe({
      next: () => {
        this.accounts.update(list => list.filter(a => a._id !== id));
        this.toast.success('Account removed');
      },
      error: () => this.toast.error('Failed to remove account'),
    });
  }

  formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
