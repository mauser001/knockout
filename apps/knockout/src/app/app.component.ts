import { Component } from '@angular/core';
import { Web3ConnectService } from './services/web3-connect.service';
import { DebuggingService } from './services/debugging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'knockout';
  isConnected$ = this.web3ConnectService.isConnected$;

  constructor(private web3ConnectService: Web3ConnectService) { }
}
