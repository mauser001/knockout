import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Web3ConnectService } from '../web3-connect.service';
import { DebuggingService } from '../debugging.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Address, readContract } from '@wagmi/core';
import { environment } from 'environment';
import { ABI_KNOCKOUT } from 'src/abis';
import { Abi } from 'viem';
import { mergeLists, removeItemFromList } from 'src/app/utils';

@Injectable({
  providedIn: 'root'
})
export class UserMappingService {
  isLoading$ = new BehaviorSubject(false);
  hasError$ = new BehaviorSubject(false);
  userNameMap$ = new BehaviorSubject<{ [name: string]: string }>({})
  private missingAddresses: string[] = [];
  private currentlyLoading: string[] = [];

  constructor(private web3ConnectService: Web3ConnectService, private deb: DebuggingService) {
    this.web3ConnectService.isConnected$.pipe(
      takeUntilDestroyed(),
      filter((value) => value)
    ).subscribe(() => this.loadPlayerNames())
  }

  addMapping = (address: string, name: string) => {
    this.userNameMap$.next({ ...this.userNameMap$.getValue(), address: name });
    removeItemFromList(name, this.missingAddresses);
  }

  loadPlayerNames = async (missing?: string[]) => {
    if (!this.web3ConnectService.isConnected$.getValue()) {
      return;
    }
    if (missing?.length) {
      this.missingAddresses = [...new Set([...this.missingAddresses, ...missing])];
    }
    const foundMap: { [name: string]: string } = {};
    let found = false;
    for (let i = this.missingAddresses.length - 1; i >= 0; i--) {
      let name = localStorage?.getItem(`name_${this.missingAddresses[i]}`)?.replace("name_", "");
      if (name) {
        foundMap[this.missingAddresses[i]] = name;
        this.missingAddresses.splice(i, 1);
        found = true;
      } else if (this.currentlyLoading.includes(this.missingAddresses[i])) {
        this.missingAddresses.splice(i, 1);
      }
    }
    if (found) {
      this.userNameMap$.next({ ...this.userNameMap$.getValue(), ...foundMap });
    }
    if (!this.missingAddresses.length) {
      this.deb.logInfo("all user names loaded.");
      return;
    }
    this.isLoading$.next(true);
    this.hasError$.next(false);
    try {
      let client = await this.web3ConnectService.getClient();
      if (!client) {
        this.deb.logWarning("no client for network");
        this.hasError$.next(true);
        return;
      }
      this.currentlyLoading = mergeLists(this.currentlyLoading, this.missingAddresses);
      const toLoad = [...this.currentlyLoading];
      const playerNames: any = await readContract({
        address: environment.knockOutContract as Address,
        abi: ABI_KNOCKOUT.abi as Abi,
        functionName: 'getPlayerNames',
        args: [toLoad]
      })
      const playerNamesMap: { [name: string]: string } = {};
      let found = false;
      for (var i = 0; i < toLoad.length; i++) {
        if (playerNames[i]?.length) {
          playerNamesMap[toLoad[i]] = playerNames[i] as string;
          localStorage?.setItem(`name_${toLoad[i]}`, playerNames[i]);
          found = true;
          removeItemFromList(toLoad[i], this.missingAddresses);
        }
        removeItemFromList(toLoad[i], this.currentlyLoading);
      }

      if (found) {
        this.userNameMap$.next({ ...this.userNameMap$.getValue(), ...playerNamesMap });
        this.deb.logInfo("player names loaded", this.userNameMap$);
      }

      if (toLoad.length) {
        this.deb.logInfo("no player names found for", this.missingAddresses);
      }

    } catch (err) {
      this.hasError$.next(true);
      this.deb.logError("error getting player names: ", err);
    }

    this.isLoading$.next(false);
  }
}
