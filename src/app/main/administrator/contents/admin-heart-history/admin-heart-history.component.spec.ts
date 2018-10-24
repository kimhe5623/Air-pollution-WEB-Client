import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHeartHistoryComponent } from './admin-heart-history.component';

describe('AdminHeartHistoryComponent', () => {
  let component: AdminHeartHistoryComponent;
  let fixture: ComponentFixture<AdminHeartHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminHeartHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHeartHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
