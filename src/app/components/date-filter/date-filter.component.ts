import {
  ChangeDetectionStrategy,
  Component,
  input,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

export type DateFilterComparison = 'matching' | 'before' | 'after';

@Component({
  selector: 'app-date-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatNativeDateModule,
    FormsModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateFilterComponent {
  label = input.required<string>();
  dateSignal = input.required<WritableSignal<Date | null>>();
  comparisonSignal = input.required<WritableSignal<DateFilterComparison>>();

  comparisonOptions = [
    { value: 'matching', label: 'Equals' },
    { value: 'before', label: 'Before' },
    { value: 'after', label: 'After' },
  ];

  constructor() {}
}
