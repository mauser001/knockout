import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentListService } from 'src/app/services/tournament-list.service';
import { Tournament } from 'src/app/models';
import { TournamentInfoComponent } from '../tournament-info/tournament-info.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, TournamentInfoComponent],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  tournaments$ = this.tournamentListService.tournaments$

  constructor(private tournamentListService: TournamentListService) { }

  trackById(index: number, item: Tournament) {
    return item.id;
  }
}
