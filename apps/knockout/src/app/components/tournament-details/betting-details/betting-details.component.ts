import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BettingDetailsService } from 'src/app/services/betting/betting-details.service';
import { TournamentDetailsService } from 'src/app/services/tournament/tournament-details.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingSpinnerComponent } from '../../common/loading-spinner/loading-spinner.component';
import { FormatEtherPipe } from 'src/app/pipes/format-ether.pipe';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddressComponent } from '../../common/address/address.component';
import { Web3ConnectService } from 'src/app/services/web3-connect.service';
import { PlaceBetService } from 'src/app/services/betting/place-bet.service';
import { parseEther } from 'viem';
import { TournamentState } from 'src/app/models';
import { ClaimBetService } from 'src/app/services/betting/claim-bet.service';
import { TournamentWrapper } from 'src/app/utils/tournament-wrapper';

@Component({
  selector: 'app-betting-details',
  standalone: true,
  imports: [
    AddressComponent,
    CommonModule,
    FormatEtherPipe,
    FormsModule,
    LoadingSpinnerComponent,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  providers: [BettingDetailsService, ClaimBetService, PlaceBetService],
  templateUrl: './betting-details.component.html',
  styleUrls: ['./betting-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BettingDetailsComponent {
  nativeCurrency$ = this.web3ConnectService.nativeCurrency$;
  bettingDetails$ = this.bettingDetailsService.bettingDetails$;
  bettingDetail = toSignal(this.bettingDetails$);
  tournament$ = this.tournamentDetailsService.tournament$;
  tournament = toSignal(this.tournament$);
  address = toSignal(this.web3ConnectService.address$);
  tWrapper = computed(() => TournamentWrapper(this.tournament()!, this.address()))
  isLoadingBetting = toSignal(this.bettingDetailsService.isLoading$);
  isLoadingTournament = toSignal(this.tournamentDetailsService.isLoading$);
  isLoadingBet$ = this.placeBetService.isLoading$;
  displayedColumns: string[] = ['address', 'total', 'byUser'];
  betForm: FormGroup;

  constructor(
    private claimBetService: ClaimBetService,
    private web3ConnectService: Web3ConnectService,
    private bettingDetailsService: BettingDetailsService,
    private tournamentDetailsService: TournamentDetailsService,
    private placeBetService: PlaceBetService,
    private fb: FormBuilder,
  ) {
    this.betForm = fb.group({
      player: new FormControl("", {
        validators: [Validators.required]
      }),
      bet: new FormControl(0.00001, { validators: [Validators.required, Validators.min(0.000000000000000001)] }),
    },)
  }

  isLoading = computed(() => this.isLoadingBetting() || this.isLoadingTournament());

  canClaimPrice = computed((): boolean => {
    const t = this.tournament();
    const b = this.bettingDetail();
    if (!t || !b || t.state < TournamentState.FINISHED) {
      return false
    }

    const can = !!b.players.find((p) => p.byUser > 0 && (t.state === TournamentState.CANCELED || t.remainingParticipants[0] === p.address))
      || (!!b.players.find((p) => p.total.toString() === "0" && t.remainingParticipants[0] === p.address) && !!b.players.find((p) => p.byUser > 0));

    return can && !b.hasWithdrawn;
  });

  onBet = async () => {
    await this.placeBetService.placeBet(this.betForm.value.player, parseEther(this.betForm.value.bet.toString()), this.tournament$.getValue()!.id);
    this.bettingDetailsService.reload();
  }

  claimPrice = async () => {
    await this.claimBetService.claim(this.tournament$.getValue()!.id);
    await this.bettingDetailsService.reload();
  }
}
