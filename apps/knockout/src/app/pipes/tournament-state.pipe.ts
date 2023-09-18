import { Pipe, PipeTransform } from '@angular/core';
import { TournamentState } from '../models/tournament';

@Pipe({
  name: 'tournamentState',
  standalone: true
})
export class TournamentStatePipe implements PipeTransform {

  transform(value: TournamentState): string {
    switch (value) {
      case TournamentState.CANCELED:
        return "Canceled";
      case TournamentState.FINISHED:
        return "Finished";
      case TournamentState.STARTED:
        return "Started";
      default:
        return "Created";
    }
  }

}
