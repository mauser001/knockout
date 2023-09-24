import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ConnectButtonComponent } from '../connect-button/connect-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { UserMappingService } from 'src/app/services/user/user-mapping.service';
import { Web3ConnectService } from 'src/app/services/web3-connect.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ConnectButtonComponent,
    MatTooltipModule,
    RouterModule,
    NgOptimizedImage],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  userNameMap = toSignal(this.userMappingService.userNameMap$);
  userAddress = toSignal(this.web3ConnectService.address$)

  userName = computed(() => this.userAddress() && this.userNameMap()?.[this.userAddress()!]);

  constructor(
    private web3ConnectService: Web3ConnectService, private userMappingService: UserMappingService) { }
}
