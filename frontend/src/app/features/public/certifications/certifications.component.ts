import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-certifications',
  imports: [RevealDirective],
  templateUrl: './certifications.component.html',
})
export class CertificationsComponent {
  portfolio = inject(PortfolioService);
}
