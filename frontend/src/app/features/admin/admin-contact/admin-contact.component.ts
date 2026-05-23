import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PortfolioService } from '../../../core/services/portfolio.service';

@Component({
  selector: 'app-admin-contact',
  imports: [FormsModule],
  templateUrl: './admin-contact.component.html',
})
export class AdminContactComponent {
  portfolio = inject(PortfolioService);
  private toast = inject(ToastrService);

  save() {
    this.portfolio.saveIdentity(this.portfolio.identity()).subscribe({
      next: () => this.toast.success('Contact info saved'),
      error: () => this.toast.error('Failed to save contact info'),
    });
  }
}
