import { Pipe, PipeTransform } from '@angular/core';
import { isInTheFutureUnix, toJSTimeStamp } from '../utils';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'registerUntil',
  standalone: true
})
export class RegisterUntilPipe implements PipeTransform {

  transform(bigDate: bigint): string {
    if (!bigDate) {
      return "date missing"
    }
    if (isInTheFutureUnix(bigDate)) {
      return formatDate(toJSTimeStamp(bigDate), "long", "en-US")
    }
    return "Registriation closed";
  }

}
