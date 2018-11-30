import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmchartTest4Component } from './amchart-test4.component';

describe('AmchartTest4Component', () => {
  let component: AmchartTest4Component;
  let fixture: ComponentFixture<AmchartTest4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmchartTest4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmchartTest4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
