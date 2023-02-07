import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TennismatchesComponent } from './tennismatches.component';

describe('TennismatchesComponent', () => {
  let component: TennismatchesComponent;
  let fixture: ComponentFixture<TennismatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TennismatchesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TennismatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
