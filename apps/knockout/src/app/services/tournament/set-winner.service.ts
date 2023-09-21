import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Web3ConnectService } from './../web3-connect.service';
import { TournamentListService } from './tournament-list.service';
import { DebuggingService } from '../debugging.service';

@Injectable({
  providedIn: 'any'
})
export class SetWinnerService {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error$: BehaviorSubject<string> = new BehaviorSubject("");

  constructor(
    private web3ConnectService: Web3ConnectService,
    private tournamentListService: TournamentListService,
    private deb: DebuggingService
  ) { }

  setWinner = async (tournamentId: number, address: string, hasWon: boolean) => {
    this.isLoading$.next(true);
    this.error$.next("");
    try {
      await this.web3ConnectService.writeContract("setVictory", [tournamentId, address, hasWon]);
      this.deb.logInfo("winner set", { tournamentId, address, hasWon });
      this.tournamentListService.reload();
    } catch (err: any) {
      this.error$.next(err.message ?? "could not set winner");
      this.deb.logError("error setting winner price ", err, { tournamentId, address, hasWon });
    }

    this.isLoading$.next(false);
  }
}
