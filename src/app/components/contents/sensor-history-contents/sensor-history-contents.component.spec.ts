import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorHistoryContentsComponent } from './sensor-history-contents.component';

describe('SensorHistoryContentsComponent', () => {
  let component: SensorHistoryContentsComponent;
  let fixture: ComponentFixture<SensorHistoryContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorHistoryContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorHistoryContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
