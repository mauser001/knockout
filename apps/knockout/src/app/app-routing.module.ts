import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  { path: '', loadComponent: () => import('./components/overview/overview.component').then(mod => mod.OverviewComponent) },
  { path: 'new', loadComponent: () => import('./components/new-tournament/new-tournament.component').then(mod => mod.NewTournamentComponent) },
  { path: 'details/:id', loadComponent: () => import('./components/tournament-details/tournament-details.component').then(mod => mod.TournamentDetailsComponent) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
