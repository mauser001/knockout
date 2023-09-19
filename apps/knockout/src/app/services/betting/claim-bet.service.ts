import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Web3ConnectService } from './../web3-connect.service';

@Injectable({
  providedIn: 'root'
})
export class ClaimBetService {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error$: BehaviorSubject<string> = new BehaviorSubject("");

  constructor(private web3ConnectService: Web3ConnectService) { }

  claim = async (tournamentId: number) => {
    this.isLoading$.next(true);
    this.error$.next("");
    try {
      await this.web3ConnectService.writeContract("claimPrice", [tournamentId], false);
    } catch (err: any) {
      this.error$.next(err.message ?? "could not claim bet");
      console.log("error claiming bet: ", err);
    }

    this.isLoading$.next(false);
  }
}
