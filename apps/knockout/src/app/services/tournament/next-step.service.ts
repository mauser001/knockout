import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Web3ConnectService } from './../web3-connect.service';
import { TournamentListService } from './tournament-list.service';

@Injectable({
  providedIn: 'root'
})
export class NextStepService {

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  hasError$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private web3ConnectService: Web3ConnectService, private tournamentListService: TournamentListService) { }

  nextStep = async (tournamentId: number, force: boolean = false) => {
    this.isLoading$.next(true);
    this.hasError$.next(false);
    try {
      await this.web3ConnectService.writeContract(force ? "forceNextStep" : "nextStep", [tournamentId]);
      this.tournamentListService.reload();
    } catch (err) {
      this.hasError$.next(true);
      console.log("error joining tournament: ", err);
    }

    this.isLoading$.next(false);
  }
}
