import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Web3ConnectService } from './web3-connect.service';
import { TournamentListService } from './tournament-list.service';
import { ABI_KNOCKOUT } from 'src/abis';
import { Abi, Address, WriteContractParameters } from 'viem';
import { environment } from 'environment';
import { waitForTransaction } from '@wagmi/core';

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
        functionName: "participate",
        account: this.web3ConnectService.address$.getValue() as Address,
        value: cost,
        args: [tournamentId]
      }
      const hash = await client.writeContract(args);
      const data = await waitForTransaction({ hash })
      this.tournamentListService.reload();
    } catch (err) {
      this.hasError$.next(true);
      console.log("error joining tournament: ", err);
    }

    this.isLoading$.next(false);
  }
}
