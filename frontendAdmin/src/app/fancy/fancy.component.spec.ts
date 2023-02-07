import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyComponent } from './fancy.component';

describe('FancyComponent', () => {
  let component: FancyComponent;
  let fixture: ComponentFixture<FancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FancyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
