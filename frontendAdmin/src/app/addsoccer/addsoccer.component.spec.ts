import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsoccerComponent } from './addsoccer.component';

describe('AddsoccerComponent', () => {
  let component: AddsoccerComponent;
  let fixture: ComponentFixture<AddsoccerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddsoccerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddsoccerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
