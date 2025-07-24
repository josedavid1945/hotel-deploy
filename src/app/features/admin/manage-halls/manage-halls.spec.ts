import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHalls } from './manage-halls';

describe('ManageHalls', () => {
  let component: ManageHalls;
  let fixture: ComponentFixture<ManageHalls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageHalls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageHalls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
