import { Pipe, PipeTransform } from '@angular/core';
import { formatEther } from 'viem';
import { Web3ConnectService } from '../services/web3-connect.service';

@Pipe({
  name: 'formatEther',
  standalone: true
})
export class FormatEtherPipe implements PipeTransform {
  constructor(private web3ConnnectService: Web3ConnectService) { }
  transform(value: bigint): unknown {
    return `${formatEther(value)} ${this.web3ConnnectService.nativeCurrency$.getValue()}`;
  }

}
