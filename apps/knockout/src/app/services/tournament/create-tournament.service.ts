import { Injectable } from '@angular/core';
import { Web3ConnectService } from './../web3-connect.service';
import { BehaviorSubject } from 'rxjs';
import { Abi, Address, Chain, WriteContractParameters, parseEther } from 'viem';
import { ABI_KNOCKOUT } from '../../../abis'
import { environment } from 'environment';
import { TournamentListService } from './tournament-list.service';
import { TournamentConfig } from 'src/app/models';
import { ethers } from 'ethers';
import { waitForTransaction } from '@wagmi/core';
import { dateToUnixString } from '../../utils';

@Injectable({
  providedIn: 'any'
})
export class CreateTournamentService {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  hasError$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private web3ConnectService: Web3ConnectService, private tournamentList: TournamentListService) { }

  create = async (config: TournamentConfig) => {
    this.isLoading$.next(true);
    this.hasError$.next(false);
    try {
      let client = await this.web3ConnectService.getClient();
      if (!client) {
        console.log("no client for network");
        this.hasError$.next(true);
        return;
      }
      let chain = this.web3ConnectService.getChain();
      if (!chain) {
        console.log("chain not found");
        this.hasError$.next(true);
        return;
      }

      let args: WriteContractParameters = {
        chain,
        abi: ABI_KNOCKOUT.abi as Abi,
        address: environment.knockOutContract as Address,
        functionName: "createTournament",
        account: this.web3ConnectService.address$.getValue() as Address,
        args: [config.tournamentName, parseEther(config.cost.toString()), config.fee?.toString() || "0", dateToUnixString(config.endDate), config.minParticipants]
      }
      const hash = await client.writeContract(args);
      const data = await waitForTransaction({ hash })
      this.tournamentList.reload();
    } catch (err) {
      this.hasError$.next(true);
      console.log("error creating tournament: ", err);
    }

    this.isLoading$.next(false);
  }
}
