import { TestBed } from '@angular/core/testing';

import { CreateTournamentService } from './create-tournament.service';

describe('CreateTournamentService', () => {
  let service: CreateTournamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateTournamentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
