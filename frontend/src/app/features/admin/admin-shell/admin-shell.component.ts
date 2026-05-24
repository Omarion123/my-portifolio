import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-shell.component.html',
})
export class AdminShellComponent {
  auth = inject(AuthService);
  sidebarOpen = signal(true);

  navItems: NavItem[] = [
    { label: 'Dashboard',      path: '/admin',                icon: '◇' },
    { label: 'Projects',       path: '/admin/projects',       icon: '□' },
    { label: 'Skills',         path: '/admin/skills',         icon: '△' },
    { label: 'Experience',     path: '/admin/experience',     icon: '▷' },
    { label: 'Education',      path: '/admin/education',      icon: '▽' },
    { label: 'Certifications', path: '/admin/certifications', icon: '✦' },
    { label: 'Blog',           path: '/admin/blog',           icon: '❡' },
    { label: 'Contact',        path: '/admin/contact',        icon: '@' },
    { label: 'Passkeys',       path: '/admin/passkeys',       icon: '🔑' },
    { label: 'GitHub',         path: '/admin/github',         icon: '⬡' },
  ];

  logout() { this.auth.logout(); }
}
