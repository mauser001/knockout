import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Web3ConnectService } from '../web3-connect.service';
import { DebuggingService } from '../debugging.service';
import { UserMappingService } from './user-mapping.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  hasError$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private web3ConnectService: Web3ConnectService, private deb: DebuggingService, private userMappingService: UserMappingService) { }

  register = async (name: string) => {
    this.isLoading$.next(true);
    this.hasError$.next(false);
    try {
      await this.web3ConnectService.writeContract("registerPlayerName", [name]);
      this.userMappingService.addMapping(this.web3ConnectService.address$.getValue(), name);
      this.deb.logInfo("Successfully registered player name", { name });
    } catch (err) {
      this.hasError$.next(true);
      this.deb.logError("error registering player name", err, { name });
    }

    this.isLoading$.next(false);
  }
}
