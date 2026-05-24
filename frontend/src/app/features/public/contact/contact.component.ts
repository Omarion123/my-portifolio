import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, RevealDirective],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  portfolio = inject(PortfolioService);
  http = inject(HttpClient);
  toastr = inject(ToastrService);

  name = signal('');
  email = signal('');
  message = signal('');
  status = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');

  submit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.status.set('sending');

    this.http.post(`${environment.apiUrl}/contact`, {
      name: this.name(),
      email: this.email(),
      message: this.message(),
    }).subscribe({
      next: () => {
        this.status.set('sent');
        this.toastr.success('Your message has been sent!', 'Message sent');
        form.resetForm();
        this.name.set('');
        this.email.set('');
        this.message.set('');
      },
      error: () => {
        this.status.set('error');
        this.toastr.error('Something went wrong — please try emailing directly.', 'Send failed');
      },
    });
  }
}
