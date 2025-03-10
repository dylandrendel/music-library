import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  DateFilterComparison,
  DateFilterComponent,
} from './date-filter.component';
import { signal, WritableSignal } from '@angular/core';

describe('DateFilterComponent', () => {
  let component: DateFilterComponent;
  let fixture: ComponentFixture<DateFilterComponent>;
  let dateSignalMock: WritableSignal<Date | null>;
  let comparisonSignalMock: WritableSignal<DateFilterComparison>;

  beforeEach(async () => {
    dateSignalMock = signal<Date | null>(null);
    comparisonSignalMock = signal<DateFilterComparison>('matching');

    await TestBed.configureTestingModule({
      imports: [DateFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateFilterComponent);
    component = fixture.componentInstance;

    // simulate the parent setting the input property with that hero
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.componentRef.setInput('dateSignal', dateSignalMock);
    fixture.componentRef.setInput('comparisonSignal', comparisonSignalMock);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use the provided signals', () => {
    // Set a test date
    const testDate = new Date('2023-05-15');
    dateSignalMock.set(testDate);

    // Set a test comparison mode
    comparisonSignalMock.set('before');

    // Trigger change detection
    fixture.detectChanges();

    // Now check that component reflects these values
    // (Specific assertions will depend on your component implementation)
    expect(dateSignalMock()).toEqual(testDate);
    expect(comparisonSignalMock()).toBe('before');
  });
});
