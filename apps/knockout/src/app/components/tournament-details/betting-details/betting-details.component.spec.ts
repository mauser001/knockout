import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingDetailsComponent } from './betting-details.component';

describe('BettingDetailsComponent', () => {
  let component: BettingDetailsComponent;
  let fixture: ComponentFixture<BettingDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BettingDetailsComponent]
    });
    fixture = TestBed.createComponent(BettingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
