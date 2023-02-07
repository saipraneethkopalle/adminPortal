import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CricketlistComponent } from './cricketlist.component';

describe('CricketlistComponent', () => {
  let component: CricketlistComponent;
  let fixture: ComponentFixture<CricketlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CricketlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CricketlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
