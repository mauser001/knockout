import { TestBed } from '@angular/core/testing';

import { ClaimBetService } from './claim-bet.service';

describe('ClaimBetService', () => {
  let service: ClaimBetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimBetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
