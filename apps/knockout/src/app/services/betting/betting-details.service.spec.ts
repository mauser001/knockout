import { TestBed } from '@angular/core/testing';

import { BettingDetailsService } from './betting-details.service';

describe('BettingDetailsService', () => {
  let service: BettingDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BettingDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
