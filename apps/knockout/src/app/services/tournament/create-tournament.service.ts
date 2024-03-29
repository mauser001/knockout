import { Injectable } from '@angular/core';
import { Web3ConnectService } from './../web3-connect.service';
import { BehaviorSubject } from 'rxjs';
import { parseEther } from 'viem';
import { TournamentListService } from './tournament-list.service';
import { TournamentConfig } from 'src/app/models';
import { dateToUnixString } from '../../utils';
import { DebuggingService } from '../debugging.service';

@Injectable({
  providedIn: 'any'
})
export class CreateTournamentService {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  hasError$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private web3ConnectService: Web3ConnectService,
    private tournamentList: TournamentListService,
    private deb: DebuggingService
  ) { }

  create = async (config: TournamentConfig) => {
    this.isLoading$.next(true);
    this.hasError$.next(false);
    try {
      await this.web3ConnectService.writeContract("createTournament", [config.tournamentName, parseEther(config.cost.toString()), config.fee?.toString() || "0", dateToUnixString(config.endDate), config.minParticipants]);
      this.deb.logInfo("successfully created tournament", config)
      await this.tournamentList.reload();
    } catch (err) {
      this.hasError$.next(true);
      this.deb.logError("error creating tournament: ", err, config);
    }

    this.isLoading$.next(false);
  }
}
