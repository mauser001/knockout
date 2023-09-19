import { TestBed } from '@angular/core/testing';

import { TournamentDetailsService } from './tournament-details.service';

describe('TournamentDetailsService', () => {
  let service: TournamentDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TournamentDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
