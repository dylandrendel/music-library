import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  isMobile: Signal<boolean | undefined>;
  constructor(private responsive: BreakpointObserver) {
    this.isMobile = toSignal(
      this.responsive
        .observe(Breakpoints.XSmall)
        .pipe(map((result) => result.matches)),
    );
  }
}
