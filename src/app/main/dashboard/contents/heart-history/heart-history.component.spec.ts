import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartHistoryComponent } from './heart-history.component';

describe('HeartHistoryComponent', () => {
  let component: HeartHistoryComponent;
  let fixture: ComponentFixture<HeartHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeartHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeartHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
