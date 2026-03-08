import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Portfolio } from './portfolio/portfolio';

export const routes: Routes = [
  { path: '', component: Portfolio },
  { path: 'login', component: Login },
];
