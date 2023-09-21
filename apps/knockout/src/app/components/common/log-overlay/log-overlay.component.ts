import { CommonModule } from '@angular/common';
import { Component, computed, ChangeDetectionStrategy, signal } from '@angular/core';
import { DebuggingService } from 'src/app/services/debugging.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { LogTypes } from 'src/app/models';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { FormatLogPipe } from 'src/app/pipes/format-log.pipe';

@Component({
  selector: 'app-log-overlay',
  templateUrl: './log-overlay.component.html',
  styleUrls: ['./log-overlay.component.scss'],
  imports: [CommonModule, FormatLogPipe, FormsModule, MatButtonToggleModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class LogOverlayComponent {
  isHidden = true;
  LogTypes = LogTypes;
  availLogTypes = [{
    label: "Info",
    value: LogTypes.Info,
  }, {
    label: "Warning",
    value: LogTypes.Warning,
  }, {
    label: "Error",
    value: LogTypes.Error,
  }]

  activeLogTypes = [...this.availLogTypes];
  activeLogTypesSignal = signal(this.activeLogTypes)
  logs = toSignal(this.deb.log$);
  filtered = computed(() => {
    return this.logs()?.filter((log) => this.activeLogTypesSignal().find((active) => active.value === log.type));
  });


  constructor(private deb: DebuggingService) {
  }

  updateActive = () => {
    this.activeLogTypesSignal.set(this.activeLogTypes)
  }
}
