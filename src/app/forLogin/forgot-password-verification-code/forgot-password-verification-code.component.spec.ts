import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordVerificationCodeComponent } from './forgot-password-verification-code.component';

describe('ForgotPasswordVerificationCodeComponent', () => {
  let component: ForgotPasswordVerificationCodeComponent;
  let fixture: ComponentFixture<ForgotPasswordVerificationCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordVerificationCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordVerificationCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
