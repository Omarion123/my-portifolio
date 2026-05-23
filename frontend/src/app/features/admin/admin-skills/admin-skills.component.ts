import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PortfolioService } from '../../../core/services/portfolio.service';

@Component({
  selector: 'app-admin-skills',
  imports: [FormsModule],
  templateUrl: './admin-skills.component.html',
})
export class AdminSkillsComponent {
  portfolio = inject(PortfolioService);
  private toast = inject(ToastrService);

  addSkill(groupIdx: number, name: string, level: number) {
    const skills = [...this.portfolio.skills()];
    skills[groupIdx] = { ...skills[groupIdx], items: [...skills[groupIdx].items, { name, level }] };
    this.portfolio.updateSection('skills', skills);
  }

  removeSkill(groupIdx: number, skillIdx: number) {
    const skills = [...this.portfolio.skills()];
    skills[groupIdx] = { ...skills[groupIdx], items: skills[groupIdx].items.filter((_, i) => i !== skillIdx) };
    this.portfolio.updateSection('skills', skills);
  }

  updateLevel(groupIdx: number, skillIdx: number, level: number) {
    const skills = [...this.portfolio.skills()];
    const items = [...skills[groupIdx].items];
    items[skillIdx] = { ...items[skillIdx], level };
    skills[groupIdx] = { ...skills[groupIdx], items };
    this.portfolio.updateSection('skills', skills);
  }

  save() {
    this.portfolio.saveSkills(this.portfolio.skills()).subscribe({
      next: () => this.toast.success('Skills saved'),
      error: () => this.toast.error('Failed to save skills'),
    });
  }
}
