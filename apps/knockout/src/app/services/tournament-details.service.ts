import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Web3ConnectService } from './web3-connect.service';
import { Tournament } from '../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Address, readContract, readContracts } from '@wagmi/core';
import { Abi } from 'viem';
import { ABI_KNOCKOUT } from 'src/abis';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root'
})
export class TournamentDetailsService {
  isLoading$ = new BehaviorSubject(false);
  hasError$ = new BehaviorSubject(false);
  tournament$ = new BehaviorSubject<Tournament | null>(null);
  hasClaimWon$ = new BehaviorSubject<{ [name: string]: boolean }>({})
  tournamentId: number = 0;



  constructor(private web3ConnectService: Web3ConnectService) {
    this.web3ConnectService.isConnected$.pipe(
      takeUntilDestroyed(),
      filter((value) => value)
    ).subscribe(this.reload)
  }

  init = (id: number) => {
    this.tournamentId = id;
    this.reload();
  }

  reload = async () => {
    if (!this.tournamentId || !this.web3ConnectService.isConnected$.getValue()) {
      return;
    }

    this.isLoading$.next(true);
    this.hasError$.next(false);
    try {
      let client = await this.web3ConnectService.getClient();
      if (!client) {
        console.log("no client for network");
        this.hasError$.next(true);
        return;
      }
      const countResult: any = await readContract({
        address: environment.knockOutContract as Address,
        abi: ABI_KNOCKOUT.abi as Abi,
        functionName: 'lastTournamentIndex'
      })
      const count = parseInt(countResult);
      let contracts = [{
        address: environment.knockOutContract as Address,
        abi: ABI_KNOCKOUT.abi as Abi,
        functionName: 'getTournament',
        args: [this.tournamentId]
      }, {
        address: environment.knockOutContract as Address,
        abi: ABI_KNOCKOUT.abi as Abi,
        functionName: 'participating',
        args: [this.tournamentId, this.web3ConnectService.address$.getValue()]
      }]
      const result = await readContracts({ contracts: contracts });
      if (!result[0].result) {
        this.hasError$.next(true);
        this.isLoading$.next(false);
        console.log("no tournament loaded");
        return
      }
      const tournament = result[0].result as Tournament;
      tournament.id = this.tournamentId;
      tournament.participating = result[1]?.result === true;
      if (tournament.remainingParticipants.length > 1 && tournament.currentStep > 0) {
        contracts = [];
        for (let i = 0; i < tournament.remainingParticipants.length; i++) {
          contracts.push({
            address: environment.knockOutContract as Address,
            abi: ABI_KNOCKOUT.abi as Abi,
            functionName: 'claimWon',
            args: [this.tournamentId, tournament.currentStep.toString(), tournament.remainingParticipants[i]]
          })
        }
        const result = await readContracts({ contracts: contracts });
        const claimWon: { [name: string]: boolean } = {}
        for (let i = 0; i < tournament.remainingParticipants.length; i++) {
          claimWon[tournament.remainingParticipants[i]] = !!result[i].result;
        }
        this.hasClaimWon$.next(claimWon);
      }
      this.tournament$.next(tournament);
    } catch (err) {
      this.hasError$.next(true);
      console.log("error loading tournament: ", err);
    }

    this.isLoading$.next(false);
  }
}
