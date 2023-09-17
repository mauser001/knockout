import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressComponent } from '../../common/address/address.component';
import { SetWinnerData } from 'src/app/models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-player-cell',
  standalone: true,
  imports: [
    AddressComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './player-cell.component.html',
  styleUrls: ['./player-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerCellComponent {
  @Input() address?: string;
  @Input() hasWon?: boolean;
  @Input() canChange?: boolean;
  @Output() setWinner: EventEmitter<SetWinnerData> = new EventEmitter();

  constructor() {
  }

  setWinnerTT = computed(() => this.hasWon ? "Set looser" : "Set winner");

  toggleWinner = () => {
    console.log(`toggleWiner: ${this.hasWon}`)
    this.setWinner.emit({ address: this.address!, hasWon: !this.hasWon })
  }
}
