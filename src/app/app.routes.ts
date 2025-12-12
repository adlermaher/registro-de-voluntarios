import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'volunteers',
        loadComponent: () => import('./features/volunteers/volunteer-list/volunteer-list.component').then(m => m.VolunteerListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'volunteers/new',
        loadComponent: () => import('./features/volunteers/volunteer-form/volunteer-form.component').then(m => m.VolunteerFormComponent),
        canActivate: [authGuard]
    },
    {
        path: 'volunteers/edit/:id',
        loadComponent: () => import('./features/volunteers/volunteer-form/volunteer-form.component').then(m => m.VolunteerFormComponent),
        canActivate: [authGuard]
    },
    {
        path: 'activities',
        loadComponent: () => import('./features/activities/activity-list/activity-list.component').then(m => m.ActivityListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'activities/new',
        loadComponent: () => import('./features/activities/activity-form/activity-form.component').then(m => m.ActivityFormComponent),
        canActivate: [authGuard]
    },
    {
        path: 'activities/edit/:id',
        loadComponent: () => import('./features/activities/activity-form/activity-form.component').then(m => m.ActivityFormComponent),
        canActivate: [authGuard]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: '**',
        loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
    }
];
