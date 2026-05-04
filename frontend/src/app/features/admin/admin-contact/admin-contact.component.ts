import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../../core/services/portfolio.service';

@Component({
  selector: 'app-admin-contact',
  imports: [FormsModule],
  templateUrl: './admin-contact.component.html',
})
export class AdminContactComponent {
  portfolio = inject(PortfolioService);
  saved = false;

  save() {
    this.portfolio.saveExperience(this.portfolio.experience()).subscribe({
      next: () => { this.saved = true; setTimeout(() => this.saved = false, 2000); },
    });
  }
}
