import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Web3ConnectService } from './../web3-connect.service';
import { Tournament } from '../../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Address, readContract, readContracts } from '@wagmi/core';
import { Abi } from 'viem';
import { ABI_KNOCKOUT } from 'src/abis';
import { environment } from 'environment';
import { DebuggingService } from '../debugging.service';

@Injectable({
  providedIn: 'any'
})
export class TournamentDetailsService {
  isLoading$ = new BehaviorSubject(false);
  hasError$ = new BehaviorSubject(false);
  tournament$ = new BehaviorSubject<Tournament | null>(null);
  hasClaimWon$ = new BehaviorSubject<{ [name: string]: boolean }>({})
  tournamentId: number = 0;



  constructor(private web3ConnectService: Web3ConnectService, private deb: DebuggingService) {
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
        this.deb.logWarning("no client for network");
        this.hasError$.next(true);
        return;
      }

      const result = await readContract({
        address: environment.knockOutContract as Address,
        abi: ABI_KNOCKOUT.abi as Abi,
        functionName: 'getTournament',
        args: [this.tournamentId]
      });
      if (!result) {
        this.hasError$.next(true);
        this.isLoading$.next(false);
        this.deb.logError("no tournament loaded", this.tournamentId);
        return
      }
      const tournament = result as Tournament;
      tournament.id = this.tournamentId;
      let contracts = [];
      for (let i = 0; i < tournament.playerCount; i++) {
        contracts.push({
          address: environment.knockOutContract as Address,
          abi: ABI_KNOCKOUT.abi as Abi,
          functionName: 'steps',
          args: [this.tournamentId, "0", i]
        })
      }
      const playerList = await readContracts({ contracts: contracts });
      tournament.participants = [];
      playerList.forEach((res) => {
        if (res.result) {
          tournament.participants!.push(res.result as string)
        }
      })
      tournament.participating = tournament.participants.includes(this.web3ConnectService.address$.getValue());
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
      this.deb.logInfo("tournament details loaded", tournament);
      this.tournament$.next(tournament);
    } catch (err) {
      this.hasError$.next(true);
      this.deb.logError("error loading tournament: ", err, this.tournamentId);
    }

    this.isLoading$.next(false);
  }
}
