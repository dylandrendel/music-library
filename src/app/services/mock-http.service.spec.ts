import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MockHttpService } from './mock-http.service';
import { DestroyRef } from '@angular/core';

describe('MockHttpService', () => {
  let service: MockHttpService;
  let destroyRefSpy: jasmine.SpyObj<DestroyRef>;

  beforeEach(() => {
    const destroyRefSpyObj = jasmine.createSpyObj('DestroyRef', ['onDestroy']);

    TestBed.configureTestingModule({
      providers: [
        MockHttpService,
        { provide: DestroyRef, useValue: destroyRefSpyObj },
      ],
    });

    service = TestBed.inject(MockHttpService);
    destroyRefSpy = TestBed.inject(DestroyRef) as jasmine.SpyObj<DestroyRef>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should emit after the mock delay', fakeAsync(() => {
      // Arrange
      let emitted = false;

      // Act
      service.get().subscribe(() => (emitted = true));
      tick(1000); // Less than MOCK_HTTP_DELAY

      // Assert
      expect(emitted).toBeFalse();

      tick(200); // Complete MOCK_HTTP_DELAY
      expect(emitted).toBeTrue();
    }));
  });

  describe('post', () => {
    it('should emit success after the mock delay for normal requests', fakeAsync(() => {
      // Arrange
      let emitted = false;

      // Act - first request should succeed
      service.post().subscribe(() => (emitted = true));
      tick(1200); // MOCK_HTTP_DELAY

      // Assert
      expect(emitted).toBeTrue();
    }));

    it('should emit error for every 5th request', fakeAsync(() => {
      // Make 4 successful requests
      for (let i = 0; i < 4; i++) {
        service.post().subscribe();
      }

      // The 5th request should fail
      let errorOccurred = false;
      service.post().subscribe(
        () => fail('should not succeed'),
        () => (errorOccurred = true),
      );

      tick(1200); // MOCK_HTTP_DELAY
      expect(errorOccurred).toBeTrue();
    }));
  });
});
