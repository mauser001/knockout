import { TestBed } from '@angular/core/testing';

import { SetWinnerService } from './set-winner.service';

describe('SetWinnerService', () => {
  let service: SetWinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetWinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
