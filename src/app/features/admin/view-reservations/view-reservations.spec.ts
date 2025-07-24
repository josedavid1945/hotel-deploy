import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReservations } from './view-reservations';

describe('ViewReservations', () => {
  let component: ViewReservations;
  let fixture: ComponentFixture<ViewReservations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewReservations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReservations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
