import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LogEntry, LogTypes } from '../models';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root'
})
export class DebuggingService {
  log$ = new BehaviorSubject<Array<LogEntry>>([]);
  constructor() { }

  logInfo(message: string, ...rest: any[]) {
    this.log(message, LogTypes.Info, rest);
    console?.info(message, rest);
  }
  logWarning(message: string, ...rest: any[]) {
    this.log(message, LogTypes.Warning, rest);
    console?.warn(message, rest);
  }
  logError(message: string, ...rest: any[]) {
    this.log(message, LogTypes.Error, rest);
    console?.error(message, rest);
  }

  private log(message: string, type: LogTypes, object?: any) {
    if (!environment.debugEnabled) {
      return;
    }
    let logs = this.log$.value;
    logs.unshift({ message, type, object, ts: Date.now() });
    if (logs.length > 20) {
      logs.pop();
    }
    this.log$.next(logs);
  }
}
