import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Web3ConnectService } from './../web3-connect.service';
import { ABI_KNOCKOUT } from 'src/abis';
import { Abi, Address } from 'viem';
import { environment } from 'environment';
import { readContract, readContracts } from '@wagmi/core';
import { Tournament } from '../../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DebuggingService } from '../debugging.service';
import { addItemToList, mergeLists } from 'src/app/utils';
import { UserMappingService } from '../user/user-mapping.service';

@Injectable({
  providedIn: 'root'
})
export class TournamentListService {
  isLoading$ = new BehaviorSubject(false);
  hasError$ = new BehaviorSubject(false);
  tournaments$ = new BehaviorSubject<Array<Tournament>>([]);


  constructor(private web3ConnectService: Web3ConnectService, private deb: DebuggingService, private userMappingService: UserMappingService) {
    this.web3ConnectService.isConnected$.pipe(
      takeUntilDestroyed(),
      filter((value) => value)
    ).subscribe(this.reload)
  }

  reload = async () => {
    if (!this.web3ConnectService.isConnected$.getValue()) {
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
      const countResult: any = await readContract({
        address: environment.knockOutContract as Address,
        abi: ABI_KNOCKOUT.abi as Abi,
        functionName: 'lastTournamentIndex'
      })
      const count = parseInt(countResult);
      let contracts = []
      for (var i = 1; i <= count; i++) {
        contracts.push({
          address: environment.knockOutContract as Address,
          abi: ABI_KNOCKOUT.abi as Abi,
          functionName: 'getTournament',
          args: [i]
        })
        contracts.push({
          address: environment.knockOutContract as Address,
          abi: ABI_KNOCKOUT.abi as Abi,
          functionName: 'participating',
          args: [i, this.web3ConnectService.address$.getValue()]
        })
      }
      const result = await readContracts({ contracts: contracts });
      const tournaments: Array<Tournament> = [];
      let addresses: string[] = [];
      for (let i = 0; i < result.length; i = i + 2) {
        const tournament = result[i].result as Tournament | undefined;
        if (tournament) {
          addItemToList(tournament.config.owner, addresses);
          if (tournament.remainingParticipants.length) {
            addresses = mergeLists(addresses, tournament.remainingParticipants);
          }
          tournament.id = i / 2 + 1;
          tournament.participating = result[i + 1]?.result === true;
          tournaments.unshift(tournament);
        }
      }
      this.userMappingService.loadPlayerNames(addresses);
      this.tournaments$.next(tournaments);
      this.deb.logInfo("tournaments length:", tournaments.length);

    } catch (err) {
      this.hasError$.next(true);
      this.deb.logError("error creating tournaments: ", err);
    }

    this.isLoading$.next(false);
  }
}
