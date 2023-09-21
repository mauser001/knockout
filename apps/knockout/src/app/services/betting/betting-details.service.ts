import { Injectable } from '@angular/core';
import { Web3ConnectService } from '../web3-connect.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, filter, map } from 'rxjs';
import { BetDetails } from 'src/app/models/betDetails';
import { TournamentDetailsService } from '../tournament/tournament-details.service';
import { Tournament } from 'src/app/models';
import { Address, readContract, readContracts } from '@wagmi/core';
import { Abi } from 'viem';
import { environment } from 'environment';
import { ABI_BET } from 'src/abis';
import { DebuggingService } from '../debugging.service';

@Injectable({
  providedIn: 'any'
})
export class BettingDetailsService {
  isLoading$ = new BehaviorSubject(false);
  hasError$ = new BehaviorSubject(false);
  bettingDetails$ = new BehaviorSubject<BetDetails | null>(null);
  hasClaimWon$ = new BehaviorSubject<{ [name: string]: boolean }>({})
  private tournament?: Tournament;

  constructor(
    private web3ConnectService: Web3ConnectService,
    private tournamentDetailsService: TournamentDetailsService,
    private deb: DebuggingService
  ) {
    combineLatest([this.web3ConnectService.isConnected$, this.tournamentDetailsService.tournament$]).pipe(
      takeUntilDestroyed(),
      filter(([isConnected, tournament]) => isConnected && !!tournament),
      map(([_, tournament]) => tournament as Tournament),
    ).subscribe(this.loadData)
  }

  reload = async () => {
    this.loadData(this.tournament)
  }

  private loadData = async (tournament?: Tournament) => {
    if (!tournament) {
      return;
    }
    this.tournament = tournament;
    this.isLoading$.next(true);
    this.hasError$.next(false);
    try {
      let client = await this.web3ConnectService.getClient();
      if (!client) {
        this.deb.logError("loading betting details - no client for network");
        this.hasError$.next(true);
        this.isLoading$.next(false);
        return;
      }
      const details: BetDetails = { hasWithdrawn: false, players: [], totalAmount: BigInt("0") };
      let contracts = [{
        address: environment.betContract as Address,
        abi: ABI_BET.abi as Abi,
        functionName: 'totalAmount',
        args: [tournament.id]
      }, {
        address: environment.betContract as Address,
        abi: ABI_BET.abi as Abi,
        functionName: 'hasWithdrawn',
        args: [tournament.id, this.web3ConnectService.address$.getValue()]
      }]
      const result = await readContracts({ contracts: contracts });
      if (result[0].result) {
        details.totalAmount = result[0].result as bigint
      }
      if (result[1].result) {
        details.hasWithdrawn = result[1].result as boolean
      }

      if (tournament.participants?.length) {
        contracts = [];
        for (let i = 0; i < tournament.participants.length; i++) {
          contracts.push({
            address: environment.betContract as Address,
            abi: ABI_BET.abi as Abi,
            functionName: 'totalAmountPerPlayer',
            args: [tournament.id, tournament.participants[i]]
          });
          contracts.push({
            address: environment.betContract as Address,
            abi: ABI_BET.abi as Abi,
            functionName: 'totalAmountPerPlayerPerUser',
            args: [tournament.id, tournament.participants[i], this.web3ConnectService.address$.getValue()]
          });
        }
        const result = await readContracts({ contracts: contracts });
        const claimWon: { [name: string]: boolean } = {}
        for (let i = 0; i < tournament.participants.length; i++) {
          details.players.push({
            address: tournament.participants[i],
            total: result[i * 2]?.result as bigint || BigInt("0"),
            byUser: result[i * 2 + 1]?.result as bigint || BigInt("0"),
          })
          claimWon[tournament.remainingParticipants[i]] = !!result[i].result;
        }
      }
      this.deb.logInfo("betting details loaded", details)
      this.bettingDetails$.next(details);
    } catch (err) {
      this.hasError$.next(true);
      this.deb.logError("error loading betting details", err, tournament);
    }

    this.isLoading$.next(false);
  }
}
