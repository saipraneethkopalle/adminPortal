import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKabbadiComponent } from './add-kabbadi.component';

describe('AddKabbadiComponent', () => {
  let component: AddKabbadiComponent;
  let fixture: ComponentFixture<AddKabbadiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddKabbadiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddKabbadiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
