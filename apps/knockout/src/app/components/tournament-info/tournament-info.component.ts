import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { computed } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card'
import { MatTooltipModule } from '@angular/material/tooltip';
import { Tournament } from 'src/app/models';
import { TournamentStatePipe } from 'src/app/pipes/tournament-state.pipe';
import { Web3ConnectService } from 'src/app/services/web3-connect.service';
import { JoinTournamentService } from 'src/app/services/tournament/join-tournament.service';
import { ClaimPriceService } from 'src/app/services/tournament/claim-price.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegisterUntilPipe } from 'src/app/pipes/register-until.pipe';
import { FormatEtherPipe } from 'src/app/pipes/format-ether.pipe';
import { TournamentWrapper } from 'src/app/utils/tournament-wrapper';
import { AddressComponent } from '../common/address/address.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tournament-info',
  standalone: true,
  imports: [
    AddressComponent,
    CommonModule,
    FormatEtherPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    RegisterUntilPipe,
    RouterModule,
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
  address = toSignal(this.web3ConnectService.address$);
  tWrapper = computed(() => TournamentWrapper(this.tournament, this.address()));

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
}
