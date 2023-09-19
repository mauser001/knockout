import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Web3ConnectService } from './../web3-connect.service';
import { TournamentListService } from './tournament-list.service';

@Injectable({
  providedIn: 'root'
})
export class ClaimPriceService {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error$: BehaviorSubject<string> = new BehaviorSubject("");

  constructor(private web3ConnectService: Web3ConnectService, private tournamentListService: TournamentListService) { }

  claim = async (tournamentId: number, forTournament: boolean = true) => {
    this.isLoading$.next(true);
    this.error$.next("");
    try {
      await this.web3ConnectService.writeContract("claimPrice", [tournamentId]);
      this.tournamentListService.reload();
    } catch (err: any) {
      this.error$.next(err.message ?? "could not claim price");
      console.log("error claiming price: ", err);
    }

    this.isLoading$.next(false);
  }
}
