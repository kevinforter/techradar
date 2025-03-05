import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LogoutComponent } from './components/auth/logout/logout.component';
import { AllTechComponent } from './components/tech/all-tech/all-tech.component';
import { TechDetailComponent } from './components/tech/tech-detail/tech-detail.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'tech', component: AllTechComponent },
  { path: 'detail/:_id', component: TechDetailComponent },
  // ... other routes
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
