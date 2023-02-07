import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowactivitiesComponent } from './showactivities.component';

describe('ShowactivitiesComponent', () => {
  let component: ShowactivitiesComponent;
  let fixture: ComponentFixture<ShowactivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowactivitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowactivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
