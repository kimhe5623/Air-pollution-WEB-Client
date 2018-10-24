import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChangepwComponent } from './admin-changepw.component';

describe('AdminChangepwComponent', () => {
  let component: AdminChangepwComponent;
  let fixture: ComponentFixture<AdminChangepwComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminChangepwComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminChangepwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
