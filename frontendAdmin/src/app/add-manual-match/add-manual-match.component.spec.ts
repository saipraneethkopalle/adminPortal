import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManualMatchComponent } from './add-manual-match.component';

describe('AddManualMatchComponent', () => {
  let component: AddManualMatchComponent;
  let fixture: ComponentFixture<AddManualMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddManualMatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddManualMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
