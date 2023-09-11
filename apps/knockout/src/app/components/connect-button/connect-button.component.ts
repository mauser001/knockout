import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Web3ConnectService } from 'src/app/services/web3-connect.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-connect-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './connect-button.component.html',
  styleUrls: ['./connect-button.component.scss']
})
export class ConnectButtonComponent {
  isConnecting$: BehaviorSubject<boolean>
  isConnected$: BehaviorSubject<boolean>

  constructor(private web3Connect: Web3ConnectService) {
    this.isConnecting$ = web3Connect.isConnecting$
    this.isConnected$ = web3Connect.isConnected$
  }

  connect() {
    console.log("button connect");
    this.web3Connect.openModal();
  }
}
