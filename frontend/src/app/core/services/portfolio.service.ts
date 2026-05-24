import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  PortfolioData, Project, SkillGroup, Experience,
  Education, Certification, BlogPost, Identity, ContributionDay
} from '../../shared/models/portfolio.models';
import { environment } from '../../../environments/environment';

const SEED: PortfolioData = {
  identity: {
    name: 'Omar Karake',
    title: 'Full-Stack Software Engineer',
    location: 'Accra, GH',
    tagline: 'I design and build fast, accessible web products — from the database up to the pixel.',
    email: 'omar.karake@amalitech.com',
    github: 'github.com/omar-karake',
    linkedin: 'linkedin.com/in/omar-karake',
    available: true,
  },
  about: {
    paragraphs: [
      'Engineer passionate about building production-grade systems that scale. I care about durable architecture, honest UX, and code the next person can actually read.',
      'Currently focused on full-stack web development and modern cloud-native architectures.',
    ],
    focus: ['Full-stack development', 'Cloud architecture', 'Developer experience'],
    stats: [
      { k: 'Projects shipped', v: '20+' },
      { k: 'Technologies', v: '15+' },
      { k: 'Coffee cups', v: '∞' },
      { k: 'Production incidents', v: '0' },
    ],
  },
  projects: [
    {
      _id: 'p1', idx: '01', title: 'Portfolio Platform',
      blurb: 'Full-stack portfolio + admin dashboard with Angular 21 and Node.js.',
      role: 'Solo', year: '2026', stack: ['Angular', 'Node.js', 'MongoDB', 'Tailwind'],
      category: 'Product', featured: true, live: '', repo: '', status: 'In Progress',
    },
  ],
  skills: [
    { group: 'Frontend', items: [{ name: 'Angular', level: 90 }, { name: 'TypeScript', level: 88 }, { name: 'Tailwind CSS', level: 85 }] },
    { group: 'Backend', items: [{ name: 'Node.js', level: 85 }, { name: 'Express', level: 82 }, { name: 'Python', level: 75 }] },
    { group: 'Databases', items: [{ name: 'MongoDB', level: 80 }, { name: 'PostgreSQL', level: 78 }, { name: 'Redis', level: 70 }] },
    { group: 'Tools', items: [{ name: 'Docker', level: 78 }, { name: 'Git', level: 90 }, { name: 'Linux', level: 85 }] },
  ],
  experience: [
    {
      _id: 'e1', role: 'Software Engineer', org: 'AmaliTech gGmbH',
      from: '2024', to: 'Present', where: 'Accra, GH',
      summary: 'Building enterprise web applications and internal tools.',
      bullets: ['Delivered multiple production-ready Angular applications.', 'Mentored junior developers.'],
    },
  ],
  education: [
    { _id: 'ed1', degree: 'B.Sc. Computer Science', org: 'University', from: '2020', to: '2024', note: 'Graduated with distinction.' },
  ],
  certifications: [
    { _id: 'c1', name: 'AWS Cloud Practitioner', org: 'Amazon Web Services', year: '2024' },
  ],
  posts: [
    { _id: 'b1', title: 'Getting started with Angular 21', excerpt: 'Exploring the latest features in Angular 21.', date: 'May 1, 2026', readMin: 5, tag: 'Frontend', published: true },
  ],
};

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  private _data = signal<PortfolioData>(SEED);
  readonly data = this._data.asReadonly();

  readonly identity = computed(() => this._data().identity);
  readonly about = computed(() => this._data().about);
  readonly projects = computed(() => this._data().projects);
  readonly skills = computed(() => this._data().skills);
  readonly experience = computed(() => this._data().experience);
  readonly education = computed(() => this._data().education);
  readonly certifications = computed(() => this._data().certifications);
  readonly posts = computed(() => this._data().posts);

  load() {
    return this.http.get<PortfolioData>(`${this.api}/portfolio`).pipe(
      tap(d => this._data.set(d)),
      catchError(() => of(SEED))
    );
  }

  updateSection<K extends keyof PortfolioData>(key: K, value: PortfolioData[K]) {
    this._data.update(d => ({ ...d, [key]: value }));
  }

  saveProjects(projects: Project[]) {
    return this.http.put<Project[]>(`${this.api}/projects`, projects).pipe(
      tap(saved => this.updateSection('projects', saved))
    );
  }

  saveSkills(skills: SkillGroup[]) {
    return this.http.put<SkillGroup[]>(`${this.api}/skills`, skills).pipe(
      tap(saved => this.updateSection('skills', saved))
    );
  }

  saveExperience(experience: Experience[]) {
    return this.http.put<Experience[]>(`${this.api}/experience`, experience).pipe(
      tap(saved => this.updateSection('experience', saved))
    );
  }

  saveEducation(education: Education[]) {
    return this.http.put<Education[]>(`${this.api}/education`, education).pipe(
      tap(saved => this.updateSection('education', saved))
    );
  }

  saveCertifications(certs: Certification[]) {
    return this.http.put<Certification[]>(`${this.api}/certifications`, certs).pipe(
      tap(saved => this.updateSection('certifications', saved))
    );
  }

  savePosts(posts: BlogPost[]) {
    return this.http.put<BlogPost[]>(`${this.api}/posts`, posts).pipe(
      tap(saved => this.updateSection('posts', saved))
    );
  }

  saveIdentity(identity: Identity) {
    return this.http.put(`${this.api}/identity`, identity).pipe(
      tap(() => this.updateSection('identity', identity))
    );
  }

  uploadImage(file: File) {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<{ url: string; publicId: string }>(`${this.api}/upload/image`, form);
  }

  getContributions(year?: number) {
    const params: Record<string, string> = year ? { year: String(year) } : {};
    return this.http.get<ContributionDay[]>(`${this.api}/github/contributions`, { params });
  }
}
