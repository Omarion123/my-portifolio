import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';
export type Accent = 'violet' | 'cyan' | 'amber' | 'emerald' | 'rose';

const ACCENTS: Record<Accent, { a: string; b: string }> = {
  violet:  { a: 'oklch(0.7 0.18 290)',  b: 'oklch(0.78 0.13 200)' },
  cyan:    { a: 'oklch(0.78 0.13 200)', b: 'oklch(0.78 0.16 160)' },
  amber:   { a: 'oklch(0.82 0.16 70)',  b: 'oklch(0.7 0.2 25)'    },
  emerald: { a: 'oklch(0.78 0.14 150)', b: 'oklch(0.78 0.13 200)' },
  rose:    { a: 'oklch(0.7 0.2 25)',    b: 'oklch(0.7 0.18 350)'  },
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>((localStorage.getItem('theme') as Theme) ?? 'dark');
  readonly accent = signal<Accent>((localStorage.getItem('accent') as Accent) ?? 'violet');

  constructor() {
    effect(() => {
      const t = this.theme();
      const ac = ACCENTS[this.accent()];
      document.documentElement.dataset['theme'] = t;
      document.documentElement.style.setProperty('--accent', ac.a);
      document.documentElement.style.setProperty('--accent-2', ac.b);
      document.documentElement.style.setProperty('--accent-soft', `color-mix(in oklch, ${ac.a} 18%, transparent)`);
      document.documentElement.style.setProperty('--accent-glow', `color-mix(in oklch, ${ac.a} 35%, transparent)`);
      localStorage.setItem('theme', t);
      localStorage.setItem('accent', this.accent());
    });
  }

  toggleTheme() {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  setAccent(accent: Accent) {
    this.accent.set(accent);
  }
}
