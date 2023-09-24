import { ChangeDetectionStrategy, Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserMappingService } from 'src/app/services/user/user-mapping.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    CommonModule,
    ClipboardModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressComponent {
  @Input({ required: true }) address?: string;
  @Input() hideCopyIcon = false;
  userNameMap$ = this.userMappingService.userNameMap$;
  userNameMap = toSignal(this.userNameMap$);

  userName = computed(() => this.address && this.userNameMap()?.[this.address]);
  shortAddress = computed(() => this.address ? `${this.address?.substring(0,
    5)}...${this.address?.substring((this.address?.length ?? 0) - 3)}` : "....");

  constructor(private userMappingService: UserMappingService) {

  }
}
