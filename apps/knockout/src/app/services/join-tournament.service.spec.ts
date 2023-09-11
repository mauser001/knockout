import { TestBed } from '@angular/core/testing';

import { JoinTournamentService } from './join-tournament.service';

describe('JoinTournamentService', () => {
  let service: JoinTournamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JoinTournamentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
