import { TestBed } from '@angular/core/testing';

import { NextStepService } from './next-step.service';

describe('NextStepService', () => {
  let service: NextStepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NextStepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
