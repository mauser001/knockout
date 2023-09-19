import { TestBed } from '@angular/core/testing';

import { ClaimWonService } from './claim-won.service';

describe('ClaimWonService', () => {
  let service: ClaimWonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimWonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
