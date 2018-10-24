import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmchartTest2Component } from './amchart-test2.component';

describe('AmchartTest2Component', () => {
  let component: AmchartTest2Component;
  let fixture: ComponentFixture<AmchartTest2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmchartTest2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmchartTest2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
