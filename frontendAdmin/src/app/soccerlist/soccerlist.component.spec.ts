import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoccerlistComponent } from './soccerlist.component';

describe('SoccerlistComponent', () => {
  let component: SoccerlistComponent;
  let fixture: ComponentFixture<SoccerlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoccerlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoccerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
