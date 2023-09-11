import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { computed, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card'
import { MatTooltipModule } from '@angular/material/tooltip';
import { Tournament } from 'src/app/models';
import { TournamentStatePipe } from 'src/app/pipes/tournament-state.pipe';
import { Web3ConnectService } from 'src/app/services/web3-connect.service';
import { BehaviorSubject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TournamentState } from 'src/app/models/tournament';
import { isInTheFutureUnix } from 'src/app/utils';
import { JoinTournamentService } from 'src/app/services/join-tournament.service';
import { RegisterUntilPipe } from 'src/app/pipes/register-until.pipe';
import { ClaimPriceService } from 'src/app/services/claim-price.service';
import { FormatEtherPipe } from 'src/app/pipes/format-ether.pipe';

@Component({
  selector: 'app-tournament-info',
  standalone: true,
  imports: [
    CommonModule,
    FormatEtherPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    RegisterUntilPipe,
    TournamentStatePipe,
  ],
  providers: [
    ClaimPriceService,
    JoinTournamentService,
  ],
  templateUrl: './tournament-info.component.html',
  styleUrls: ['./tournament-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TournamentInfoComponent {
  @Input({ required: true }) tournament?: Tournament;
  address$: BehaviorSubject<string> = new BehaviorSubject("")
  address = toSignal(this.web3ConnectService.address$)

  constructor(
    private web3ConnectService: Web3ConnectService,
    private joinTournamentService: JoinTournamentService,
    private claimPriceService: ClaimPriceService
  ) { }

  participate = () => {
    this.tournament && this.joinTournamentService.participate(this.tournament.id, this.tournament.config.ticketCost);
  }

  claimPrice = () => {
    this.tournament && this.claimPriceService.claim(this.tournament.id, true);
  }

  isOwner = computed(() => {
    return this.address() === this.tournament?.config.owner;
  });

  canJoin = computed(() => {
    return !this.isOwner() && this.tournament && isInTheFutureUnix(this.tournament.config.registerEndDate) && !this.tournament.participating;
  });

  canClaim = computed(() => {
    return this.tournament?.state === TournamentState.CANCELED || (this.tournament?.state === TournamentState.FINISHED && (this.tournament?.winner === this.address() || (this.tournament?.config.fee > 0 && this.isOwner())));
  });
}
