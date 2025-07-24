import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookRoom } from './book-room';

describe('BookRoom', () => {
  let component: BookRoom;
  let fixture: ComponentFixture<BookRoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookRoom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookRoom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
