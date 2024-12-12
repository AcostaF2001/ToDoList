import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { AppLayoutComponent } from './components/layout/app.layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' }, // Redirige al Login por defecto
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      // Aquí puedes agregar más rutas protegidas
    ],
  },
  { path: '**', redirectTo: 'auth/login' }, // Redirige al Login para rutas no encontradas
];
