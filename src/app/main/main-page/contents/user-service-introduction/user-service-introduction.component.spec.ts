import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserServiceIntroductionComponent } from './user-service-introduction.component';

describe('UserServiceIntroductionComponent', () => {
  let component: UserServiceIntroductionComponent;
  let fixture: ComponentFixture<UserServiceIntroductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserServiceIntroductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserServiceIntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
