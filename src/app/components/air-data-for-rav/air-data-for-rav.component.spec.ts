import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirDataForRavComponent } from './air-data-for-rav.component';

describe('AirDataForRavComponent', () => {
  let component: AirDataForRavComponent;
  let fixture: ComponentFixture<AirDataForRavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirDataForRavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirDataForRavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
