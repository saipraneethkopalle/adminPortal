import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetlimitComponent } from './setlimit.component';

describe('SetlimitComponent', () => {
  let component: SetlimitComponent;
  let fixture: ComponentFixture<SetlimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetlimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetlimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
