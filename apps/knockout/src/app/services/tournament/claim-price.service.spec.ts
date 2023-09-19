import { TestBed } from '@angular/core/testing';

import { ClaimPriceService } from './claim-price.service';

describe('ClaimPriceService', () => {
  let service: ClaimPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
