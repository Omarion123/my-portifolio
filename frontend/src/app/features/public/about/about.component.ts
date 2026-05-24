import { Component, inject, signal, computed } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, catchError, map } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { ContributionHeatmapComponent } from '../../../shared/components/contribution-heatmap/contribution-heatmap.component';
import { ContributionDay } from '../../../shared/models/portfolio.models';

@Component({
  selector: 'app-about',
  imports: [RevealDirective, ContributionHeatmapComponent],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  portfolio = inject(PortfolioService);

  currentYear = new Date().getFullYear();
  selectedYear = signal<number | null>(null);

  availableYears = computed(() =>
    Array.from({ length: 5 }, (_, i) => this.currentYear - i)
  );

  contributions = toSignal(
    toObservable(this.selectedYear).pipe(
      switchMap(year => {
        if (year !== null) {
          return this.portfolio.getContributions(year).pipe(
            catchError(() => of([] as ContributionDay[]))
          );
        }
        // Rolling view: merge current and previous year so the 365-day window is complete
        return combineLatest([
          this.portfolio.getContributions(this.currentYear).pipe(catchError(() => of([] as ContributionDay[]))),
          this.portfolio.getContributions(this.currentYear - 1).pipe(catchError(() => of([] as ContributionDay[]))),
        ]).pipe(map(([curr, prev]) => [...prev, ...curr]));
      })
    ),
    { initialValue: [] as ContributionDay[] }
  );

  onYearChange(value: string): void {
    this.selectedYear.set(value ? +value : null);
  }
}
