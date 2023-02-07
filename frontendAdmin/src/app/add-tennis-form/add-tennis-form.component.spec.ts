import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTennisFormComponent } from './add-tennis-form.component';

describe('AddTennisFormComponent', () => {
  let component: AddTennisFormComponent;
  let fixture: ComponentFixture<AddTennisFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTennisFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTennisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
