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
  isConnecting$ = this.web3ConnectService.isConnecting$;
  isConnected$ = this.web3ConnectService.isConnected$;

  constructor(private web3ConnectService: Web3ConnectService) { }

  connect() {
    this.web3ConnectService.openModal();
  }
}
