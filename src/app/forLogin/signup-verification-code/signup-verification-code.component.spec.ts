import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupVerificationCodeComponent } from './signup-verification-code.component';

describe('SignupVerificationCodeComponent', () => {
  let component: SignupVerificationCodeComponent;
  let fixture: ComponentFixture<SignupVerificationCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupVerificationCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupVerificationCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
