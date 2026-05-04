import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-blog',
  imports: [RevealDirective],
  templateUrl: './blog.component.html',
})
export class BlogComponent {
  portfolio = inject(PortfolioService);
}
