import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsView } from './events-view';

describe('EventsView', () => {
  let component: EventsView;
  let fixture: ComponentFixture<EventsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
