import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HallsView } from './halls-view';

describe('HallsView', () => {
  let component: HallsView;
  let fixture: ComponentFixture<HallsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HallsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HallsView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
