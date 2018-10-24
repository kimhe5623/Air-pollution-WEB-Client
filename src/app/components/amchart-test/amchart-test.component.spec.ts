import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmchartTestComponent } from './amchart-test.component';

describe('AmchartTestComponent', () => {
  let component: AmchartTestComponent;
  let fixture: ComponentFixture<AmchartTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmchartTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmchartTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
