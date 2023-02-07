import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyactivitiesComponent } from './fancyactivities.component';

describe('FancyactivitiesComponent', () => {
  let component: FancyactivitiesComponent;
  let fixture: ComponentFixture<FancyactivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FancyactivitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FancyactivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
