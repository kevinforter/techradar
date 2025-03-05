import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TechService } from '../../services/tech/tech.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthState } from '../../services/auth/auth-state.service';
import { AllTechComponent } from '../tech/all-tech/all-tech.component';

@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule, ReactiveFormsModule, AllTechComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent implements OnInit {
  isAuthorized = false;
  addTechForm!: FormGroup;

  @ViewChild(AllTechComponent) allTechComponent!: AllTechComponent;

  constructor(
    private techService: TechService,
    private router: Router,
    private location: Location,
    private authState: AuthState,
  ) {}

  ngOnInit(): void {
    this.isAuthorized = this.authState.checkIfAdmin();

    // Initialize the form for adding a new tech entry.
    this.addTechForm = new FormGroup({
      name: new FormControl('', Validators.required),
      ring: new FormControl(''),
      category: new FormControl('', Validators.required),
      techDescription: new FormControl('', Validators.required),
      classificationDescription: new FormControl(''),
      status: new FormControl('draft', Validators.required),
    });

    // Listen for status changes and update validators accordingly
    this.addTechForm.get('status')?.valueChanges.subscribe((status) => {
      if (status === 'published') {
        this.addTechForm.get('ring')?.setValidators(Validators.required);
        this.addTechForm
          .get('classificationDescription')
          ?.setValidators(Validators.required);
      } else if (status === 'draft') {
        this.addTechForm.get('ring')?.clearValidators();
        this.addTechForm.get('classificationDescription')?.clearValidators();
      }
      // Update the validation status after changing validators.
      this.addTechForm.get('ring')?.updateValueAndValidity();
      this.addTechForm
        .get('classificationDescription')
        ?.updateValueAndValidity();
    });
  }

  onAddTech(): void {
    if (this.addTechForm.valid) {
      this.techService.addTech(this.addTechForm.value).subscribe({
        next: (response) => {
          if (this.allTechComponent) {
            this.allTechComponent.getAllTech();
          }
          alert('Tech added successfully');
          this.addTechForm.reset();
        },
        error: (err) => {
          console.error('Error adding tech:', err);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tech']);
  }
}
