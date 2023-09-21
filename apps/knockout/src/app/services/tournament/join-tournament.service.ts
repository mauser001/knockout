import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Web3ConnectService } from './../web3-connect.service';
import { TournamentListService } from './tournament-list.service';
import { DebuggingService } from '../debugging.service';

@Injectable({
  providedIn: 'any'
})
export class JoinTournamentService {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  hasError$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private web3ConnectService: Web3ConnectService,
    private tournamentListService: TournamentListService,
    private deb: DebuggingService
  ) { }

  participate = async (tournamentId: number, cost: bigint) => {
    this.isLoading$.next(true);
    this.hasError$.next(false);
    try {
      await this.web3ConnectService.writeContract("participate", [tournamentId], true, cost);
      this.deb.logInfo("successfully joined tournament", { tournamentId, cost })
      this.tournamentListService.reload();
    } catch (err) {
      this.hasError$.next(true);
      this.deb.logError("error joining tournament: ", err, { tournamentId, cost });
    }

    this.isLoading$.next(false);
  }
}
