import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorManagementContentsComponent } from './sensor-management-contents.component';

describe('SensorManagementContentsComponent', () => {
  let component: SensorManagementContentsComponent;
  let fixture: ComponentFixture<SensorManagementContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorManagementContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorManagementContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
