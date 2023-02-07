import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TennislistComponent } from './tennislist.component';

describe('TennislistComponent', () => {
  let component: TennislistComponent;
  let fixture: ComponentFixture<TennislistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TennislistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TennislistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
