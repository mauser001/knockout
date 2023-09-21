import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Web3ConnectService } from './../web3-connect.service';
import { TournamentListService } from './tournament-list.service';
import { DebuggingService } from '../debugging.service';

@Injectable({
  providedIn: 'any'
})
export class NextStepService {

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  hasError$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private web3ConnectService: Web3ConnectService, private tournamentListService: TournamentListService, private deb: DebuggingService) { }

  nextStep = async (tournamentId: number, force: boolean = false) => {
    this.isLoading$.next(true);
    this.hasError$.next(false);
    try {
      await this.web3ConnectService.writeContract(force ? "forceNextStep" : "nextStep", [tournamentId]);
      this.deb.logInfo("Successfully proceeded to next step", { tournamentId, force });
      this.tournamentListService.reload();
    } catch (err) {
      this.hasError$.next(true);
      this.deb.logError("error proceeding to next step", err, { tournamentId, force });
    }

    this.isLoading$.next(false);
  }
}
