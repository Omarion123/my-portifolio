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
    { label: 'Dashboard', path: '/admin', icon: 'grid' },
    { label: 'Projects', path: '/admin/projects', icon: 'folder' },
    { label: 'Skills', path: '/admin/skills', icon: 'code' },
    { label: 'Experience', path: '/admin/experience', icon: 'briefcase' },
    { label: 'Education', path: '/admin/education', icon: 'book' },
    { label: 'Certifications', path: '/admin/certifications', icon: 'badge' },
    { label: 'Blog', path: '/admin/blog', icon: 'edit' },
    { label: 'Contact', path: '/admin/contact', icon: 'mail' },
  ];

  logout() { this.auth.logout(); }
}
