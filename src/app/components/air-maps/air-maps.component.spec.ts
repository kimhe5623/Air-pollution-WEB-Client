import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirMapsComponent } from './air-maps.component';

describe('AirMapsComponent', () => {
  let component: AirMapsComponent;
  let fixture: ComponentFixture<AirMapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirMapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
