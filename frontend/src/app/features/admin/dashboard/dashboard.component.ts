import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../../core/services/portfolio.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  portfolio = inject(PortfolioService);

  quickLinks = [
    { label: 'Manage Projects', path: '/admin/projects', emoji: '📁' },
    { label: 'Manage Skills', path: '/admin/skills', emoji: '⚡' },
    { label: 'Manage Experience', path: '/admin/experience', emoji: '💼' },
    { label: 'Manage Blog', path: '/admin/blog', emoji: '✍️' },
    { label: 'Manage Education', path: '/admin/education', emoji: '🎓' },
    { label: 'Certifications', path: '/admin/certifications', emoji: '🏅' },
    { label: 'Contact Info', path: '/admin/contact', emoji: '📬' },
    { label: 'View Portfolio', path: '/', emoji: '🌐' },
  ];
}
