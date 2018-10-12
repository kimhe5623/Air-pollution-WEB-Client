import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeregisterAccountComponent } from './deregister-account.component';

describe('DeregisterAccountComponent', () => {
  let component: DeregisterAccountComponent;
  let fixture: ComponentFixture<DeregisterAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeregisterAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeregisterAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
