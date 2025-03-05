import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthState } from '../../../services/auth/auth-state.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  message = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private authState: AuthState,
  ) {}

  ngOnInit(): void {
    // Initialize the form here so that FormBuilder is available.
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.message = 'Login successful!';
          console.log(response);

          // Store the access token (and refresh token if needed)
          // localStorage.setItem('accessToken', response.accessToken);
          this.authState.login(
            response.accessToken,
            response.refreshToken.token,
          );

          // Navigate to the TechComponent and handle the returned promise
          this.router
            .navigate(['/tech'])
            .then((success) => {
              console.log('Navigation successful:', success);
            })
            .catch((err) => {
              console.error('Navigation error:', err);
            });
        },
        error: (error) => {
          this.message = 'Login failed. ' + error.error?.error;
          console.error(error);
        },
      });
    }
  }
}
