import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-education',
  imports: [RevealDirective],
  templateUrl: './education.component.html',
})
export class EducationComponent {
  portfolio = inject(PortfolioService);
}
