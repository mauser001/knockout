import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Web3ConnectService } from './../web3-connect.service';
import { DebuggingService } from '../debugging.service';

@Injectable({
  providedIn: 'any'
})
export class ClaimBetService {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error$: BehaviorSubject<string> = new BehaviorSubject("");

  constructor(
    private web3ConnectService: Web3ConnectService,
    private deb: DebuggingService
  ) { }

  claim = async (tournamentId: number) => {
    this.isLoading$.next(true);
    this.error$.next("");
    try {
      await this.web3ConnectService.writeContract("claimPrice", [tournamentId], false);
      this.deb.logInfo("successfully claimed bet", tournamentId)
    } catch (err: any) {
      this.error$.next(err.message ?? "could not claim bet");
      this.deb.logError("error claiming bet", err, tournamentId);
    }

    this.isLoading$.next(false);
  }
}
