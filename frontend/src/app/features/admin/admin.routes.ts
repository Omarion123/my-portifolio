import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-shell/admin-shell.component').then(m => m.AdminShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'projects',
        loadComponent: () => import('./admin-projects/admin-projects.component').then(m => m.AdminProjectsComponent),
      },
      {
        path: 'skills',
        loadComponent: () => import('./admin-skills/admin-skills.component').then(m => m.AdminSkillsComponent),
      },
      {
        path: 'experience',
        loadComponent: () => import('./admin-experience/admin-experience.component').then(m => m.AdminExperienceComponent),
      },
      {
        path: 'education',
        loadComponent: () => import('./admin-education/admin-education.component').then(m => m.AdminEducationComponent),
      },
      {
        path: 'certifications',
        loadComponent: () => import('./admin-certifications/admin-certifications.component').then(m => m.AdminCertificationsComponent),
      },
      {
        path: 'blog',
        loadComponent: () => import('./admin-blog/admin-blog.component').then(m => m.AdminBlogComponent),
      },
      {
        path: 'contact',
        loadComponent: () => import('./admin-contact/admin-contact.component').then(m => m.AdminContactComponent),
      },
      {
        path: 'identity',
        loadComponent: () => import('./admin-identity/admin-identity.component').then(m => m.AdminIdentityComponent),
      },
      {
        path: 'passkeys',
        loadComponent: () => import('./admin-passkeys/admin-passkeys.component').then(m => m.AdminPasskeysComponent),
      },
      {
        path: 'github',
        loadComponent: () => import('./admin-github/admin-github.component').then(m => m.AdminGithubComponent),
      },
    ],
  },
];
