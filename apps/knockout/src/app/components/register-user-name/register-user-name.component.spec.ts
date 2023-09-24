import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUserNameComponent } from './register-user-name.component';

describe('RegisterUserNameComponent', () => {
  let component: RegisterUserNameComponent;
  let fixture: ComponentFixture<RegisterUserNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegisterUserNameComponent]
    });
    fixture = TestBed.createComponent(RegisterUserNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
