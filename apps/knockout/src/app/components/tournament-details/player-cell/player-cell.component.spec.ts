import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerCellComponent } from './player-cell.component';

describe('PlayerCellComponent', () => {
  let component: PlayerCellComponent;
  let fixture: ComponentFixture<PlayerCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PlayerCellComponent]
    });
    fixture = TestBed.createComponent(PlayerCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
