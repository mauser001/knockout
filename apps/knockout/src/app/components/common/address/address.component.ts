import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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

}
