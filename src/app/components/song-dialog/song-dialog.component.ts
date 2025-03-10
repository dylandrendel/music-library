import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  Inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  DialogPosition,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Song } from '../../models/song.model';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SongsService } from '../../services/songs.service';
import { TitleCasePipe } from '@angular/common';
import { ResponsiveService } from '../../services/responsive.service';

@Component({
  selector: 'app-song-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './song-dialog.component.html',
  styleUrl: './song-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongDialogComponent implements OnInit {
  songForm!: FormGroup;
  isPhonePortrait = signal(false);
  updating = signal(false);

  constructor(
    private dialogRef: MatDialogRef<SongDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public song: Song,
    public responsive: ResponsiveService,
    private destroyRef: DestroyRef,
    public songsService: SongsService,
    private fb: FormBuilder,
  ) {
    effect(() => {
      const isMobile = this.responsive.isMobile();
      const dialogMargin = isMobile ? '5%' : '20%';
      const dialogWidth = isMobile ? '90%' : '60%';
      this.dialogRef.updateSize(dialogWidth);
      const newPosition: DialogPosition = {
        left: dialogMargin,
        right: dialogMargin,
      };
      this.dialogRef.updatePosition(newPosition);
    });
  }

  ngOnInit() {
    this.songForm = this.fb.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      releaseDate: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
    });

    if (this.song) {
      this.songForm.setValue({
        title: this.song.title,
        artist: this.song.artist,
        releaseDate: this.song.releaseDate,
        price: this.song.price,
      });
    }
  }

  onSubmit() {
    if (this.songForm.valid) {
      const form = this.songForm.getRawValue();
      const titleCase = new TitleCasePipe();
      const song: Song = {
        title: titleCase.transform(form.title!), // enforce title case for sorting and consistency
        artist: titleCase.transform(form.artist!),
        releaseDate: form.releaseDate!,
        price: Math.round(form.price! * 100) / 100, // round to 2 decimal places
        id: this.song ? this.song.id : this.songsService.songs().length + 1,
      };
      const updateObs$ = this.song
        ? this.songsService.updateSong(song)
        : this.songsService.addSong(song);
      updateObs$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (song) => this.dialogRef.close(song),
      });
    }
  }
}
