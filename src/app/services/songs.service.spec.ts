import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SongsService } from './songs.service';
import { SnackbarService } from './snackbar.service';
import { MockHttpService } from './mock-http.service';
import { of, throwError } from 'rxjs';
import { Song } from '../models/song.model';
import { initialSongs } from '../data/initialSongs';

describe('SongsService', () => {
  let service: SongsService;
  let mockHttpSpy: jasmine.SpyObj<MockHttpService>;
  let snackbarSpy: jasmine.SpyObj<SnackbarService>;

  beforeEach(() => {
    const mockHttpSpyObj = jasmine.createSpyObj('MockHttpService', [
      'get',
      'post',
    ]);
    const snackbarSpyObj = jasmine.createSpyObj('SnackbarService', [
      'showSuccess',
      'showError',
    ]);

    // Default mock responses
    mockHttpSpyObj.get.and.returnValue(of(0));
    mockHttpSpyObj.post.and.returnValue(of(0));

    TestBed.configureTestingModule({
      providers: [
        SongsService,
        { provide: MockHttpService, useValue: mockHttpSpyObj },
        { provide: SnackbarService, useValue: snackbarSpyObj },
      ],
    });

    mockHttpSpy = mockHttpSpyObj;
    snackbarSpy = snackbarSpyObj;

    service = new SongsService(snackbarSpyObj, mockHttpSpyObj);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSongs', () => {
    it('should set loading state while getting songs', fakeAsync(() => {
      // Act
      const result = service.getSongs();

      // Assert
      expect(service.loadingSongs()).toBeTrue();

      // Complete the observable
      result.subscribe();
      tick();

      expect(service.loadingSongs()).toBeFalse();
    }));

    it('should return initial songs after http call completes', fakeAsync(() => {
      // Act
      let resultSongs: Song[] = [];
      service.getSongs().subscribe((songs) => (resultSongs = songs));
      tick();

      // Assert
      expect(resultSongs).toEqual(initialSongs);
    }));
  });

  describe('addSong', () => {
    it('should add song to state and show success message on successful add', fakeAsync(() => {
      // Arrange
      const newSong = new Song(
        99,
        'Test Song',
        'Test Artist',
        new Date(),
        1.99,
      );

      // Act
      service.addSong(newSong).subscribe();
      tick();

      // Assert
      expect(snackbarSpy.showSuccess).toHaveBeenCalledWith(
        `Successfully added ${newSong.title}`,
      );
      expect(service.songs()).toContain(newSong);
    }));

    it('should show error message when adding a song fails', fakeAsync(() => {
      // Arrange
      const newSong = new Song(
        99,
        'Test Song',
        'Test Artist',
        new Date(),
        1.99,
      );
      mockHttpSpy.post.and.returnValue(throwError(() => new Error('Failed')));

      // Act
      service.addSong(newSong).subscribe(
        () => fail('should have failed'),
        () => {}, // expect error
      );
      tick();

      // Assert
      expect(snackbarSpy.showError).toHaveBeenCalledWith('Failed to add song');
      expect(service.songs()).not.toContain(newSong);
    }));

    it('should correctly set the next song ID', fakeAsync(() => {
      // Arrange
      const newSong = new Song(
        99,
        'Test Song',
        'Test Artist',
        new Date(),
        1.99,
      );

      // Act
      service.addSong(newSong).subscribe();
      tick();

      // Assert
      expect(service.getNextSongId()).toBe(100);
    }));
  });

  describe('updateSong', () => {
    it('should update song in state and show success message on successful update', fakeAsync(() => {
      // Arrange
      const initialSong = new Song(
        1,
        'Original Title',
        'Artist',
        new Date(),
        1.99,
      );
      const updatedSong = new Song(
        1,
        'Updated Title',
        'Artist',
        new Date(),
        2.99,
      );
      service['_songs'].set([initialSong]);
      mockHttpSpy.post.and.returnValue(of(0));

      // Act
      service.updateSong(updatedSong).subscribe();
      tick();

      // Assert
      expect(snackbarSpy.showSuccess).toHaveBeenCalledWith(
        `Successfully updated ${updatedSong.title}`,
      );
      expect(service.songs()[0].title).toBe('Updated Title');
      expect(service.songs()[0].price).toBe(2.99);
    }));
  });

  describe('deleteSong', () => {
    it('should remove song from state and show success message on successful delete', fakeAsync(() => {
      // Arrange
      const song1 = new Song(1, 'Song 1', 'Artist 1', new Date(), 1.99);
      const song2 = new Song(2, 'Song 2', 'Artist 2', new Date(), 2.99);
      service['_songs'].set([song1, song2]);
      mockHttpSpy.post.and.returnValue(of(0));

      // Act
      service.deleteSong(song1).subscribe();
      tick();

      // Assert
      expect(snackbarSpy.showSuccess).toHaveBeenCalledWith(
        `Successfully deleted ${song1.title}`,
      );
      expect(service.songs().length).toBe(1);
      expect(service.songs()[0].id).toBe(2);
    }));
  });

  describe('dateFiltering', () => {
    it('should return all songs when no date filter is set', () => {
      // Arrange
      const songs = [
        new Song(1, 'Song 1', 'Artist', new Date('2020-01-01'), 1.99),
        new Song(2, 'Song 2', 'Artist', new Date('2021-01-01'), 2.99),
      ];
      service['_songs'].set(songs);
      service.dateFilter.set(null);

      // Act & Assert
      expect(service.filteredSongs()).toEqual(songs);
    });

    it('should filter songs by matching date when mode is "matching"', () => {
      // Arrange
      const matchDate = new Date('2020-01-01');
      const songs = [
        new Song(1, 'Song 1', 'Artist', new Date('2020-01-01'), 1.99),
        new Song(2, 'Song 2', 'Artist', new Date('2021-01-01'), 2.99),
      ];
      service['_songs'].set(songs);
      service.dateFilter.set(matchDate);
      service.dateFilterMode.set('matching');

      // Act & Assert
      expect(service.filteredSongs().length).toBe(1);
      expect(service.filteredSongs()[0].id).toBe(1);
    });

    it('should filter songs before a date when mode is "before"', () => {
      // Arrange
      const cutoffDate = new Date('2021-01-01');
      const songs = [
        new Song(1, 'Song 1', 'Artist', new Date('2020-01-01'), 1.99),
        new Song(2, 'Song 2', 'Artist', new Date('2021-01-01'), 2.99),
        new Song(3, 'Song 3', 'Artist', new Date('2022-01-01'), 3.99),
      ];
      service['_songs'].set(songs);
      service.dateFilter.set(cutoffDate);
      service.dateFilterMode.set('before');

      // Act & Assert
      expect(service.filteredSongs().length).toBe(1);
      expect(service.filteredSongs()[0].id).toBe(1);
    });

    it('should filter songs after a date when mode is "after"', () => {
      // Arrange
      const cutoffDate = new Date('2021-01-01');
      const songs = [
        new Song(1, 'Song 1', 'Artist', new Date('2020-01-01'), 1.99),
        new Song(2, 'Song 2', 'Artist', new Date('2021-01-01'), 2.99),
        new Song(3, 'Song 3', 'Artist', new Date('2022-01-01'), 3.99),
      ];
      service['_songs'].set(songs);
      service.dateFilter.set(cutoffDate);
      service.dateFilterMode.set('after');

      // Act & Assert
      expect(service.filteredSongs().length).toBe(1);
      expect(service.filteredSongs()[0].id).toBe(3);
    });
  });
});
