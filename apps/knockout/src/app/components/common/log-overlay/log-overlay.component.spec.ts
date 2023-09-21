import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogOverlayComponent } from './log-overlay.component';

describe('LogOverlayComponent', () => {
  let component: LogOverlayComponent;
  let fixture: ComponentFixture<LogOverlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogOverlayComponent]
    });
    fixture = TestBed.createComponent(LogOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
