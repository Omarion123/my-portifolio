import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../../core/services/portfolio.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  portfolio = inject(PortfolioService);
  year = new Date().getFullYear();

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
