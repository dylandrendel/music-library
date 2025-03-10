import { computed, DestroyRef, Injectable, signal } from '@angular/core';
import { Song } from '../models/song.model';
import { initialSongs } from '../data/initialSongs';
import { finalize, of, switchMap, tap, throwError, timer } from 'rxjs';
import { SnackbarService } from './snackbar.service';
import { MockHttpService } from './mock-http.service';
import { DateFilterComparison } from '../components/date-filter/date-filter.component';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  private _songs = signal<Song[]>([]);
  get songs() {
    return this._songs.asReadonly();
  }

  dateFilter = signal<Date | null>(null);
  dateFilterMode = signal<DateFilterComparison>('matching');
  filteredSongs = computed(() => {
    const date = this.dateFilter();
    const mode = this.dateFilterMode();
    if (!date) {
      return this._songs();
    }
    return this._songs().filter((song) => {
      const songDate = new Date(song.releaseDate);

      // Reset time parts for accurate date comparison
      const compareDate = new Date(date);
      compareDate.setHours(0, 0, 0, 0);
      songDate.setHours(0, 0, 0, 0);

      switch (mode) {
        case 'matching':
          return songDate.getTime() === compareDate.getTime();
        case 'before':
          return songDate.getTime() < compareDate.getTime();
        case 'after':
          return songDate.getTime() > compareDate.getTime();
        default:
          return true;
      }
    });
  });

  private _loadingSongs = signal(false);
  get loadingSongs() {
    return this._loadingSongs.asReadonly();
  }

  private _updating = signal(false);
  get updating() {
    return this._updating.asReadonly();
  }

  constructor(
    private snackbar: SnackbarService,
    private mockHttp: MockHttpService,
  ) {
    this.getSongs().subscribe((songs) => {
      this._songs.set(songs);
    });
  }

  getSongs() {
    this._loadingSongs.set(true);
    return this.mockHttp.get().pipe(
      finalize(() => this._loadingSongs.set(false)),
      switchMap(() => of(initialSongs)),
    );
  }

  addSong(song: Song) {
    this._updating.set(true);
    return this.mockHttp.post().pipe(
      finalize(() => this._updating.set(false)),
      switchMap(() => of(song)),
      tap({
        next: (song) => {
          this.snackbar.showSuccess(`Successfully added ${song.title}`);
          this.addSongToState(song);
        },
        error: (err) => {
          console.error(err);
          this.snackbar.showError('Failed to add song');
        },
      }),
    );
  }

  updateSong(song: Song) {
    this._updating.set(true);
    return this.mockHttp.post().pipe(
      finalize(() => this._updating.set(false)),
      switchMap(() => of(song)),
      tap({
        next: (song) => {
          this.snackbar.showSuccess(`Successfully updated ${song.title}`);
          this.updateSongInState(song);
        },
        error: (err) => {
          console.error(err);
          this.snackbar.showError('Failed to update song');
        },
      }),
    );
  }

  deleteSong(song: Song) {
    this._updating.set(true);
    return this.mockHttp.post().pipe(
      finalize(() => this._updating.set(false)),
      switchMap(() => of(song)),
      tap({
        next: (song) => {
          this.snackbar.showSuccess(`Successfully deleted ${song.title}`);
          this.deleteSongFromState(song);
        },
        error: (err) => {
          console.error(err);
          this.snackbar.showError('Failed to delete song');
        },
      }),
    );
  }

  private addSongToState(song: Song) {
    this._songs.update((songs) => [...songs, song]);
  }

  private updateSongInState(song: Song) {
    this._songs.update((songs) =>
      songs.map((s) => (s.id === song.id ? song : s)),
    );
  }

  private deleteSongFromState(song: Song) {
    this._songs.update((songs) => songs.filter((s) => s.id !== song.id));
  }
}
