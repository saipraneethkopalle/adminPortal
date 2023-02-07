import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MActivitiesComponent } from './mactivities.component';

describe('MActivitiesComponent', () => {
  let component: MActivitiesComponent;
  let fixture: ComponentFixture<MActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MActivitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
