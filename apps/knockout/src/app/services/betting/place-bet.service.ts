import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Web3ConnectService } from './../web3-connect.service';
import { DebuggingService } from '../debugging.service';

@Injectable({
  providedIn: 'any'
})
export class PlaceBetService {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error$: BehaviorSubject<string> = new BehaviorSubject("");

  constructor(
    private web3ConnectService: Web3ConnectService,
    private deb: DebuggingService
  ) { }

  placeBet = async (player: string, amount: bigint, tournamentId: number) => {
    this.isLoading$.next(true);
    this.error$.next("");
    try {
      await this.web3ConnectService.writeContract("placeABet", [tournamentId, player], false, amount);
      this.deb.logInfo("successfully placed bet: ", { player, amount, tournamentId });
    } catch (err: any) {
      this.error$.next(err.message ?? "could not place bet");
      this.deb.logError("error placing bet: ", err, { player, amount, tournamentId });
    }

    this.isLoading$.next(false);
  }
}
