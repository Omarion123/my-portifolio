import { Component, inject, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { PortfolioService } from '../../../core/services/portfolio.service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  theme = inject(ThemeService);
  portfolio = inject(PortfolioService);
  scrolled = signal(false);

  links = [
    { label: 'Work',    href: '#projects' },
    { label: 'About',   href: '#about' },
    { label: 'Writing', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 8);
  }

  scrollTo(id: string, event: Event) {
    event.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
