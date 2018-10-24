import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeregisterAccountComponent } from './admin-deregister-account.component';

describe('AdminDeregisterAccountComponent', () => {
  let component: AdminDeregisterAccountComponent;
  let fixture: ComponentFixture<AdminDeregisterAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDeregisterAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDeregisterAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
