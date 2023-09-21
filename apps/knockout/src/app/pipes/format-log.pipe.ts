import { Pipe, PipeTransform } from '@angular/core';
import { LogEntry, LogTypes } from '../models';

@Pipe({
  name: 'formatLog',
  standalone: true
})
export class FormatLogPipe implements PipeTransform {

  transform(log: LogEntry): string {
    let typeLabel = "Info";
    switch (log.type) {
      case LogTypes.Error:
        typeLabel = "Error";
        break;
      case LogTypes.Warning:
        typeLabel = "Warning";
        break;
    }

    return `[${new Date(log.ts).toISOString()}] ${typeLabel}: ${log.message} | ${JSON.stringify(log.object, (key, value) => {
      if (["_events"].includes(key)) {
        return null;
      }
      return typeof value === 'bigint'
        ? value.toString()
        : value // return everything else unchanged
    })}`;
  }

}
