import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartHistoryContentsComponent } from './heart-history-contents.component';

describe('HeartHistoryContentsComponent', () => {
  let component: HeartHistoryContentsComponent;
  let fixture: ComponentFixture<HeartHistoryContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeartHistoryContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeartHistoryContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
