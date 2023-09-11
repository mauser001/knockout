import { TestBed } from '@angular/core/testing';

import { Web3ConnectService } from './web3-connect.service';

describe('Web3ConnectService', () => {
  let service: Web3ConnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Web3ConnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
