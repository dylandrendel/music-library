import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, throwError, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockHttpService {
  private MOCK_HTTP_DELAY = 1200;
  private errorCounter = 0;
  constructor(private destroyRef: DestroyRef) {}

  get() {
    return timer(this.MOCK_HTTP_DELAY).pipe(
      takeUntilDestroyed(this.destroyRef),
    );
  }

  post() {
    this.errorCounter++;
    const delay = timer(this.MOCK_HTTP_DELAY).pipe(
      takeUntilDestroyed(this.destroyRef),
    );
    if (this.errorCounter % 5 === 0) {
      return delay.pipe(
        switchMap(() => throwError(() => new Error('Failed to add song'))),
      );
    }
    return delay;
  }
}
