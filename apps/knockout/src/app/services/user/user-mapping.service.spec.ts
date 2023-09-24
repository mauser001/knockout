import { TestBed } from '@angular/core/testing';

import { UserMappingService } from './user-mapping.service';

describe('UserMappingService', () => {
  let service: UserMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
