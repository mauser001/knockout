import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Web3ConnectService } from './../web3-connect.service';
import { TournamentListService } from './tournament-list.service';
import { DebuggingService } from '../debugging.service';

@Injectable({
  providedIn: 'any'
})
export class ClaimWonService {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error$: BehaviorSubject<string> = new BehaviorSubject("");

  constructor(
    private web3ConnectService: Web3ConnectService,
    private tournamentListService: TournamentListService,
    private deb: DebuggingService
  ) { }

  claimWon = async (tournamentId: number) => {
    this.isLoading$.next(true);
    this.error$.next("");
    try {
      await this.web3ConnectService.writeContract("claimVictory", [tournamentId]);
      this.deb.logInfo("successfully claimed won", tournamentId)
      this.tournamentListService.reload();
    } catch (err: any) {
      this.error$.next(err.message ?? "could not claim won");
      this.deb.logError("error claiming won ", err, tournamentId);
    }

    this.isLoading$.next(false);
  }
}
