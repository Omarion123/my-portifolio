import { Component, inject, OnInit } from '@angular/core';
import { NavComponent } from '../../../shared/components/nav/nav.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { ProjectsComponent } from '../projects/projects.component';
import { SkillsComponent } from '../skills/skills.component';
import { ExperienceComponent } from '../experience/experience.component';
import { EducationComponent } from '../education/education.component';
import { CertificationsComponent } from '../certifications/certifications.component';
import { BlogComponent } from '../blog/blog.component';
import { ContactComponent } from '../contact/contact.component';
import { PortfolioService } from '../../../core/services/portfolio.service';

@Component({
  selector: 'app-home',
  imports: [
    NavComponent, FooterComponent,
    HeroComponent, AboutComponent, ProjectsComponent,
    SkillsComponent, ExperienceComponent, EducationComponent,
    CertificationsComponent, BlogComponent, ContactComponent,
  ],
  template: `
    <app-nav />
    <main>
      <app-hero />
      <app-about />
      <app-projects />
      <app-skills />
      <app-experience />
      <app-education />
      <app-certifications />
      <app-blog />
      <app-contact />
    </main>
    <app-footer />
  `,
})
export class HomeComponent implements OnInit {
  private portfolio = inject(PortfolioService);

  ngOnInit() {
    this.portfolio.load().subscribe();
  }
}
