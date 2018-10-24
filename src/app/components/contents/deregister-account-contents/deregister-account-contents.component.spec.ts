import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeregisterAccountContentsComponent } from './deregister-account-contents.component';

describe('DeregisterAccountContentsComponent', () => {
  let component: DeregisterAccountContentsComponent;
  let fixture: ComponentFixture<DeregisterAccountContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeregisterAccountContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeregisterAccountContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
