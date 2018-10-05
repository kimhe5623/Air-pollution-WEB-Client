import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapClusteringComponent } from './map-clustering.component';

describe('MapClusteringComponent', () => {
  let component: MapClusteringComponent;
  let fixture: ComponentFixture<MapClusteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapClusteringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapClusteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
