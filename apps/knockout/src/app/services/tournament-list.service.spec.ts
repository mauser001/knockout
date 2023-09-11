import { TestBed } from '@angular/core/testing';

import { TournamentListService } from './tournament-list.service';

describe('TournamentListService', () => {
  let service: TournamentListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TournamentListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
