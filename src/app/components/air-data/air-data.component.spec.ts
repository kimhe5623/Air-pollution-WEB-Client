import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirDataComponent } from './air-data.component';

describe('AirDataComponent', () => {
  let component: AirDataComponent;
  let fixture: ComponentFixture<AirDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
