import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserManagementContentsComponent } from './admin-user-management-contents.component';

describe('AdminUserManagementContentsComponent', () => {
  let component: AdminUserManagementContentsComponent;
  let fixture: ComponentFixture<AdminUserManagementContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUserManagementContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserManagementContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
