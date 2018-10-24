import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMainContentsComponent } from './user-main-contents.component';

describe('UserMainContentsComponent', () => {
  let component: UserMainContentsComponent;
  let fixture: ComponentFixture<UserMainContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMainContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMainContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
