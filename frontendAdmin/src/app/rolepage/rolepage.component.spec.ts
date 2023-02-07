import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolepageComponent } from './rolepage.component';

describe('RolepageComponent', () => {
  let component: RolepageComponent;
  let fixture: ComponentFixture<RolepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
