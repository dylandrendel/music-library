import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ViewChild,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SongDialogComponent } from '../song-dialog/song-dialog.component';
import { Song } from '../../models/song.model';
import { SongsService } from '../../services/songs.service';
import { DateFilterComponent } from '../date-filter/date-filter.component';
import { ResponsiveService } from '../../services/responsive.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-songs-manager',
  imports: [
    DatePipe,
    CurrencyPipe,
    MatProgressBarModule,
    MatDividerModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    DateFilterComponent,
  ],
  templateUrl: './songs-manager.component.html',
  styleUrl: './songs-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongsManagerComponent {
  dataSource: MatTableDataSource<Song>;
  displayedColumns: string[] = [
    'title',
    'artist',
    'releaseDate',
    'price',
    'actions',
  ];
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public songsService: SongsService,
    private dialog: MatDialog,
    public responsive: ResponsiveService,
  ) {
    this.dataSource = new MatTableDataSource(songsService.filteredSongs());
    this.dataSource.sort = this.sort;

    effect(() => {
      this.dataSource.data = songsService.filteredSongs();
      this.dataSource.sort = this.sort;
    });
  }

  deleteSong(song: Song) {
    if (
      confirm(
        `Are you sure you want to delete ${song.title} from your song library?`,
      )
    ) {
      this.songsService.deleteSong(song).subscribe();
    }
  }

  openDialog(song?: Song) {
    this.dialog.open<SongDialogComponent, Song, Song>(SongDialogComponent, {
      data: song,
    });
  }
}
