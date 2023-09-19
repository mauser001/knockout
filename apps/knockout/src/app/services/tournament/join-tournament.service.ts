import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Web3ConnectService } from './../web3-connect.service';
import { TournamentListService } from './tournament-list.service';

@Injectable({
  providedIn: 'any'
})
export class JoinTournamentService {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  hasError$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private web3ConnectService: Web3ConnectService, private tournamentListService: TournamentListService) { }

  participate = async (tournamentId: number, cost: bigint) => {
    this.isLoading$.next(true);
    this.hasError$.next(false);
    try {
      await this.web3ConnectService.writeContract("participate", [tournamentId], true, cost);
      this.tournamentListService.reload();
    } catch (err) {
      this.hasError$.next(true);
      console.log("error joining tournament: ", err);
    }

    this.isLoading$.next(false);
  }
}
