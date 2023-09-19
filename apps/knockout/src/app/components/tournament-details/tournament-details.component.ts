import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3ConnectService } from 'src/app/services/web3-connect.service';
import { JoinTournamentService } from 'src/app/services/tournament/join-tournament.service';
import { ClaimPriceService } from 'src/app/services/tournament/claim-price.service';
import { TournamentDetailsService } from 'src/app/services/tournament/tournament-details.service';
import { NextStepService } from 'src/app/services/tournament/next-step.service';
import { ClaimWonService } from 'src/app/services/tournament/claim-won.service';
import { SetWinnerService } from 'src/app/services/tournament/set-winner.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TournamentStatePipe } from 'src/app/pipes/tournament-state.pipe';
import { FormatEtherPipe } from 'src/app/pipes/format-ether.pipe';
import { RegisterUntilPipe } from 'src/app/pipes/register-until.pipe';
import { TournamentWrapper } from 'src/app/utils/tournament-wrapper';
import { AddressComponent } from '../common/address/address.component';
import { LoadingSpinnerComponent } from '../common/loading-spinner/loading-spinner.component';
import { PlayerCellComponent } from './player-cell/player-cell.component';
import { SetWinnerData, TournamentState } from 'src/app/models';

@Component({
  selector: 'app-tournament-details',
  standalone: true,
  imports: [
    AddressComponent,
    CommonModule,
    FormatEtherPipe,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    PlayerCellComponent,
    RegisterUntilPipe,
    LoadingSpinnerComponent,
    TournamentStatePipe
  ],
  providers: [
    ClaimPriceService,
    ClaimWonService,
    JoinTournamentService,
    NextStepService,
    SetWinnerService,
    TournamentDetailsService
  ],
  templateUrl: './tournament-details.component.html',
  styleUrls: ['./tournament-details.component.scss']
})
export class TournamentDetailsComponent {
  isLoading$ = this.tournamentDetailsService.isLoading$;
  address = toSignal(this.web3ConnectService.address$);
  tournamentId = 0;
  tournament$ = this.tournamentDetailsService.tournament$;
  tournament = toSignal(this.tournamentDetailsService.tournament$)
  hasClaimWon = toSignal(this.tournamentDetailsService.hasClaimWon$)
  tWrapper = computed(() => TournamentWrapper(this.tournament()!, this.address()))
  displayedColumns: string[] = ['player1', 'player2'];
  claimWonTableData = computed(() => {
    const list: Array<{ player1: string; player2?: string; player1Won: boolean; player2Won: boolean }> = []
    const participants = this.tournament()?.remainingParticipants ?? [];
    if (!this.hasClaimWon() || participants.length < 2) {
      return list;
    }
    for (let i = 0; i < participants.length; i += 2) {
      list.push({
        player1: participants[i],
        player2: participants[i + 1],
        player1Won: !!this.hasClaimWon()![participants[i]],
        player2Won: participants[i + 1] ? !!this.hasClaimWon()![participants[i + 1]] : false,
      })
    }
    // return this.tournament()?.remainingParticipants.map((address) => ({ address, hasWon: !!this.claimWon()![address] }))


    return list;
  })

  constructor(
    private route: ActivatedRoute,
    private web3ConnectService: Web3ConnectService,
    private joinTournamentService: JoinTournamentService,
    private claimPriceService: ClaimPriceService,
    private claimWonService: ClaimWonService,
    private nextStepService: NextStepService,
    private setWinnerService: SetWinnerService,
    private tournamentDetailsService: TournamentDetailsService
  ) {
    this.route.params.pipe(takeUntilDestroyed()).subscribe(params => {
      this.tournamentId = params['id'];
      this.tournamentDetailsService.init(this.tournamentId);
    });
  }

  canProceed = computed((): { valid: boolean; force: boolean; } | null => {
    const t = this.tournament();
    if (!this.tWrapper().isOwner || !t || t.state !== TournamentState.STARTED || t.remainingParticipants.length <= 1) {
      return null
    }
    let valid = true;
    let force = false;
    const hasWon = this.hasClaimWon()!;
    for (let i = 0; i < t.remainingParticipants.length; i += 2) {
      if (hasWon[t.remainingParticipants[i]] && t.remainingParticipants[i + 1] && hasWon[t.remainingParticipants[i + 1]]) {
        valid = false;
      } else if (!hasWon[t.remainingParticipants[i]] && t.remainingParticipants[i + 1] && !hasWon[t.remainingParticipants[i + 1]]) {
        force = true
      }
    }

    return { valid, force };
  });

  participate = () => {
    this.tournament() && this.joinTournamentService.participate(this.tournamentId, this.tournament()!.config.ticketCost);
  }

  claimPrice = () => {
    this.claimPriceService.claim(this.tournamentId, true);
  }

  claimWon = async () => {
    await this.claimWonService.claimWon(this.tournamentId);
    this.tournamentDetailsService.reload();
  }

  nextStep = async (force = false) => {
    await this.nextStepService.nextStep(this.tournamentId, force)
    this.tournamentDetailsService.reload();
  }

  setWinner = async ({ address, hasWon }: SetWinnerData) => {
    console.log("setWinner")
    await this.setWinnerService.setWinner(this.tournamentId, address, hasWon);
    this.tournamentDetailsService.reload();
  }
}
