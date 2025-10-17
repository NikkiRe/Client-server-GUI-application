import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { MainPageComponent } from './main-page/main-page.component';

export const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'main', component: MainPageComponent },
  { path: '**', redirectTo: '' }
];