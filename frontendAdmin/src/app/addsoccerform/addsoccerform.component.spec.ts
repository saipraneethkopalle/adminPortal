import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsoccerformComponent } from './addsoccerform.component';

describe('AddsoccerformComponent', () => {
  let component: AddsoccerformComponent;
  let fixture: ComponentFixture<AddsoccerformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddsoccerformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddsoccerformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
