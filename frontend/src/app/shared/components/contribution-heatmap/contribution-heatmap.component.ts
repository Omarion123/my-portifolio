import { Component, input, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ContributionDay } from '../../models/portfolio.models';

type Cell = ContributionDay | null;

interface MonthLabel { weekIndex: number; label: string; }

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

@Component({
  selector: 'app-contribution-heatmap',
  imports: [DecimalPipe],
  templateUrl: './contribution-heatmap.component.html',
})
export class ContributionHeatmapComponent {
  days = input<ContributionDay[]>([]);
  year = input<number | null>(null);

  total    = computed(() => this.days().reduce((sum, d) => sum + d.count, 0));
  heading  = computed(() => {
    const y = this.year();
    return y ? `contributions in ${y}` : 'contributions in the last year';
  });
  weeks    = computed(() => {
    const y = this.year();
    return y ? this.buildFullYearWeeks(this.days(), y) : this.buildRollingWeeks(this.days());
  });
  monthLabels = computed(() => this.buildMonthLabels(this.weeks()));

  monthLeft(weekIndex: number): string {
    const total = this.weeks().length || 1;
    return `${(weekIndex / total) * 100}%`;
  }

  level(count: number): number {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
  }

  tooltip(day: ContributionDay): string {
    return `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${day.date}`;
  }

  private buildFullYearWeeks(days: ContributionDay[], year: number): Cell[][] {
    const dataMap = new Map(days.map(d => [d.date, d.count]));
    const allDays: ContributionDay[] = [];
    const cursor = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    while (cursor <= yearEnd) {
      const iso = cursor.toISOString().split('T')[0];
      allDays.push({ date: iso, count: dataMap.get(iso) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
    const firstDow = new Date(year, 0, 1).getDay();
    const padded: Cell[] = [...Array(firstDow).fill(null), ...allDays];
    const weeks: Cell[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
      const week = padded.slice(i, i + 7);
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }
    while (weeks.length < 53) weeks.push(Array(7).fill(null) as Cell[]);
    return weeks;
  }

  private buildRollingWeeks(days: ContributionDay[]): Cell[][] {
    const dataMap = new Map(days.map(d => [d.date, d.count]));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(today.getDate() - 364);
    // Align start to Sunday
    const padStart = new Date(start);
    padStart.setDate(start.getDate() - start.getDay());

    const cells: Cell[] = [];
    for (let d = new Date(padStart); d < start; d.setDate(d.getDate() + 1)) {
      cells.push(null);
    }
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const iso = d.toISOString().split('T')[0];
      cells.push({ date: iso, count: dataMap.get(iso) ?? 0 });
    }

    const weeks: Cell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      const week = cells.slice(i, i + 7);
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }
    return weeks;
  }

  private buildMonthLabels(weeks: Cell[][]): MonthLabel[] {
    const labels: MonthLabel[] = [];
    let lastMonth = -1;
    for (let i = 0; i < weeks.length; i++) {
      const first = weeks[i].find((d): d is ContributionDay => d !== null);
      if (!first) continue;
      const month = new Date(first.date + 'T00:00:00').getMonth();
      if (month !== lastMonth) {
        labels.push({ weekIndex: i, label: MONTH_NAMES[month] });
        lastMonth = month;
      }
    }
    return labels;
  }
}
