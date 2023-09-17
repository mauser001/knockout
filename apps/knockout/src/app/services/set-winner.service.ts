import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Web3ConnectService } from './web3-connect.service';
import { TournamentListService } from './tournament-list.service';
import { ABI_KNOCKOUT } from 'src/abis';
import { Abi, Address, WriteContractParameters } from 'viem';
import { environment } from 'environment';
import { waitForTransaction } from '@wagmi/core';

@Injectable({
  providedIn: 'root'
})
export class SetWinnerService {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error$: BehaviorSubject<string> = new BehaviorSubject("");

  constructor(private web3ConnectService: Web3ConnectService, private tournamentListService: TournamentListService) { }

  setWinner = async (tournamentId: number, address: string, hasWon: boolean) => {
    this.isLoading$.next(true);
    this.error$.next("");
    try {
      let client = await this.web3ConnectService.getClient();
      if (!client) {
        console.log("no client for network");
        this.error$.next("no client for network");
        return;
      }
      let chain = this.web3ConnectService.getChain();
      if (!chain) {
        console.log("chain not found");
        this.error$.next("chain not found");
        return;
      }

      let args: WriteContractParameters = {
        chain,
        abi: ABI_KNOCKOUT.abi as Abi,
        address: environment.knockOutContract as Address,
        functionName: "setVictory",
        account: this.web3ConnectService.address$.getValue() as Address,
        args: [tournamentId, address, hasWon]
      }
      const hash = await client.writeContract(args);
      const data = await waitForTransaction({ hash })
      this.tournamentListService.reload();
    } catch (err: any) {
      this.error$.next(err.message ?? "could not set winner");
      console.log("error setting winner price: ", err);
    }

    this.isLoading$.next(false);
  }
}
