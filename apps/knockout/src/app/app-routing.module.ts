import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  { path: 'new', loadComponent: () => import('./components/new-tournament/new-tournament.component').then(mod => mod.NewTournamentComponent) },
  { path: 'register', loadComponent: () => import('./components/register-user-name/register-user-name.component').then(mod => mod.RegisterUserNameComponent) },
  { path: 'details/:id', loadComponent: () => import('./components/tournament-details/tournament-details.component').then(mod => mod.TournamentDetailsComponent) },
  { path: '**', loadComponent: () => import('./components/overview/overview.component').then(mod => mod.OverviewComponent) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
