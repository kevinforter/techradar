import { Component, OnInit } from '@angular/core';
import { NgIf, UpperCasePipe, CommonModule, Location } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { TechService } from '../../../services/tech/tech.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthState } from '../../../services/auth/auth-state.service';

@Component({
  selector: 'app-tech-detail',
  imports: [
    NgIf,
    UpperCasePipe,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './tech-detail.component.html',
  styleUrls: ['./tech-detail.component.scss'],
})
export class TechDetailComponent implements OnInit {
  isAuthorized = false;
  techForm!: FormGroup;
  error: string = '';
  techId?: string;
  editMode: boolean = false;
  originalTech: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private techService: TechService,
    private authState: AuthState,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.isAuthorized = this.authState.checkIfAdmin();
    this.techId = String(this.route.snapshot.paramMap.get('_id'));
    this.initializeForm();
    this.getTech();
  }

  initializeForm(): void {
    this.techForm = new FormGroup({
      name: new FormControl('', Validators.required),
      ring: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      techDescription: new FormControl('', Validators.required),
      classificationDescription: new FormControl('', Validators.required),
      status: new FormControl(''),
      createdAt: new FormControl(''),
      updatedAt: new FormControl(''),
      publicationDate: new FormControl(''),
    });
    this.techForm.disable();
  }

  toggleEdit(): void {
    if (!this.editMode) {
      // Enable editing.
      this.techForm.enable();
      this.editMode = true;
    } else {
      // Cancel editing: revert to original values and disable the form.
      this.techForm.patchValue(this.originalTech);
      this.techForm.disable();
      this.editMode = false;
    }
  }

  getTech(): void {
    if (this.techId) {
      this.techService.getTech(this.techId).subscribe({
        next: (tech) => {
          if (tech) {
            this.originalTech = { ...tech };
            this.techForm.patchValue({
              name: tech.name,
              ring: tech.ring,
              category: tech.category,
              techDescription: tech.techDescription,
              classificationDescription: tech.classificationDescription,
              status: tech.status,
              createdAt: tech.createdAt,
              updatedAt: tech.createdAt,
              publicationDate: tech.publicationDate,
            });
            if (!this.editMode) {
              this.techForm.disable();
            }
          } else {
            this.error = 'Tech data is undefined';
          }
        },
        error: (err) => {
          this.error = 'Error fetching tech data.';
          console.error(err);
        },
      });
    }
  }

  deleteTech(): void {
    if (this.techId && this.isAuthorized) {
      this.techService.deleteTech(this.techId).subscribe({
        next: () => {
          this.router.navigate(['/tech']);
          console.log('Tech deleted successfully.');
        },
        error: (error) => {
          console.error('Deletion failed:', error);
        },
      });
    }
  }

  updateTech(): void {
    if (this.techId && this.isAuthorized) {
      const techData = this.techForm.getRawValue();
      this.techService.updateTech(this.techId, techData).subscribe({
        next: (updatedTech) => {
          this.originalTech = { ...updatedTech };
          this.techForm.patchValue(updatedTech);
          this.techForm.disable();
          this.editMode = false;
          console.log('Tech updated successfully.');
        },
        error: (error) => {
          console.error('Update failed:', error);
        },
      });
    }
  }

  publishTech(): void {
    const techData = this.techForm.getRawValue();
    if (this.allFieldsHaveValue(techData) && this.techId && this.isAuthorized) {
      this.techService.publishTech(this.techId, this.techForm.value).subscribe({
        next: (publishedTech) => {
          this.originalTech = { ...publishedTech };
          this.techForm.patchValue(publishedTech);
          this.techForm.disable();
          this.editMode = false;
          console.log('Tech published successfully.');
        },
        error: (error) => {
          console.error('Publishing failed:', error);
        },
      });
    }
  }

  allFieldsHaveValue(values: any): boolean {
    return (
      values.name?.toString().trim().length > 0 &&
      values.ring?.toString().trim().length > 0 &&
      values.category?.toString().trim().length > 0 &&
      values.techDescription?.toString().trim().length > 0 &&
      values.classificationDescription?.toString().trim().length > 0
    );
  }

  get canPublish(): boolean {
    return this.allFieldsHaveValue(this.techForm.getRawValue());
  }

  goBack(): void {
    this.location.back();
  }
}
