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
        return "canceled";
      case TournamentState.FINISHED:
        return "finished";
      case TournamentState.STARTED:
        return "started";
      default:
        return "created";
    }
  }

}
