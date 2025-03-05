import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechService } from '../../../services/tech/tech.service';
import { Tech } from '../../../tech';
import { RouterLink, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-tech',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './all-tech.component.html',
  styleUrl: './all-tech.component.css',
})
export class AllTechComponent implements OnInit {
  @Input() isAdminPanel: boolean = false;
  techData: any;
  error: string = '';
  arrTech: { [category: string]: { [maturity: string]: Tech[] } } = {};
  selectedTechs: string[] = [];
  activeCategory: string = 'all';

  // Utility function to get keys of an object.
  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  constructor(
    private techService: TechService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getAllTech();
  }

  getAllTech(): void {
    this.techService.getAllTech().subscribe({
      next: (data) => {
        this.arrTech = data;
      },
      error: (err) => {
        this.error = 'Error fetching tech data.';
        console.error(err);
      },
    });
  }

  // Update the active category when a tab is clicked.
  setActiveCategory(category: string): void {
    this.activeCategory = category;
  }

  // Called when a checkbox is toggled.
  onSelectTech(event: Event, techId: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedTechs.push(techId);
      console.log(this.selectedTechs);
    } else {
      this.selectedTechs = this.selectedTechs.filter((id) => id !== techId);
    }
  }

  // Deletes the selected tech items.
  deleteSelectedTechs(): void {
    // Call the service to delete multiple techs
    this.techService.deleteMultipleTech(this.selectedTechs).subscribe({
      next: () => {
        // Iterate over each category and maturity level to filter out the deleted techs
        Object.keys(this.arrTech).forEach((category) => {
          Object.keys(this.arrTech[category]).forEach((maturity) => {
            this.arrTech[category][maturity] = this.arrTech[category][
              maturity
            ].filter((tech) => !this.selectedTechs.includes(tech._id));
          });
        });
        // Reset the selectedTechs array after deletion.
        this.selectedTechs = [];
      },
      error: (err) => {
        console.error(
          `Error deleting techs with ids ${this.selectedTechs}:`,
          err,
        );
      },
    });
  }
}
