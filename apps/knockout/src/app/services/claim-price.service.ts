import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Web3ConnectService } from './web3-connect.service';
import { TournamentListService } from './tournament-list.service';
import { ABI_BET, ABI_KNOCKOUT } from 'src/abis';
import { Abi, Address, WriteContractParameters } from 'viem';
import { environment } from 'environment';

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
        abi: (forTournament ? ABI_KNOCKOUT.abi : ABI_BET.abi) as Abi,
        address: (forTournament ? environment.knockOutContract : environment.betContract) as Address,
        functionName: "claimPrice",
        account: this.web3ConnectService.address$.getValue() as Address,
        args: [tournamentId]
      }
      await client.writeContract(args);
      this.tournamentListService.reload();
    } catch (err: any) {
      this.error$.next(err.message ?? "could not claim price");
      console.log("error claiming price: ", err);
    }

    this.isLoading$.next(false);
  }
}
