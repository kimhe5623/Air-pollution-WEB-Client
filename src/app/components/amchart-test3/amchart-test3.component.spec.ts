import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmchartTest3Component } from './amchart-test3.component';

describe('AmchartTest3Component', () => {
  let component: AmchartTest3Component;
  let fixture: ComponentFixture<AmchartTest3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmchartTest3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmchartTest3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
