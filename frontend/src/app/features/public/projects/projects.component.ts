import { Component, inject, signal, computed } from '@angular/core';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-projects',
  imports: [RevealDirective],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent {
  portfolio = inject(PortfolioService);
  activeFilter = signal<string>('All');

  categories = computed(() => {
    const cats = ['All', ...new Set(this.portfolio.projects().map(p => p.category))];
    return cats;
  });

  filtered = computed(() => {
    const f = this.activeFilter();
    if (f === 'All') return this.portfolio.projects();
    return this.portfolio.projects().filter(p => p.category === f);
  });

  setFilter(cat: string) { this.activeFilter.set(cat); }
}
