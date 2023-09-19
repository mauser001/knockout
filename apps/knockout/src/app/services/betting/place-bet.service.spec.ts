import { TestBed } from '@angular/core/testing';

import { PlaceBetService } from './place-bet.service';

describe('PlaceBetService', () => {
  let service: PlaceBetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaceBetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
