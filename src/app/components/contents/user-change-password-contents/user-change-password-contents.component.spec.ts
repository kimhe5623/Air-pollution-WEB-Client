import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChangePasswordContentsComponent } from './user-change-password-contents.component';

describe('UserChangePasswordContentsComponent', () => {
  let component: UserChangePasswordContentsComponent;
  let fixture: ComponentFixture<UserChangePasswordContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserChangePasswordContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserChangePasswordContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
