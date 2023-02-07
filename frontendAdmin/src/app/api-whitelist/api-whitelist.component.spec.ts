import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiWhitelistComponent } from './api-whitelist.component';

describe('ApiWhitelistComponent', () => {
  let component: ApiWhitelistComponent;
  let fixture: ComponentFixture<ApiWhitelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiWhitelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiWhitelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
