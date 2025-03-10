import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SongDialogComponent } from './song-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { Song } from '../../models/song.model';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SongsService } from '../../services/songs.service';
import { ResponsiveService } from '../../services/responsive.service';
import { DestroyRef } from '@angular/core';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('SongDialogComponent', () => {
  let component: SongDialogComponent;
  let fixture: ComponentFixture<SongDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<SongDialogComponent>>;
  let songsServiceSpy: jasmine.SpyObj<SongsService>;
  let responsiveServiceSpy: jasmine.SpyObj<ResponsiveService>;
  let destroyRefSpy: jasmine.SpyObj<DestroyRef>;

  // Helper function to set form values
  const setFormValues = (
    title: string,
    artist: string,
    releaseDate: Date | null,
    price: number,
  ) => {
    component.songForm.setValue({
      title: title,
      artist: artist,
      releaseDate: releaseDate,
      price: price,
    });
  };

  // Helper function to get form control error state
  const getFormControlError = (controlName: string, errorName: string) => {
    const control = component.songForm.get(controlName);
    return control?.hasError(errorName);
  };

  beforeEach(async () => {
    // Create spies for all services
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [
      'close',
      'updateSize',
      'updatePosition',
    ]);
    songsServiceSpy = jasmine.createSpyObj(
      'SongsService',
      ['addSong', 'updateSong', 'songs', 'getNextSongId'],
      { updating: signal(false) },
    );
    songsServiceSpy.songs.and.returnValue([]);
    songsServiceSpy.addSong.and.returnValue(
      of(new Song(1, 'New Song', 'New Artist', new Date(), 1.99)),
    );
    songsServiceSpy.updateSong.and.returnValue(
      of(new Song(1, 'Updated Song', 'Updated Artist', new Date(), 2.99)),
    );

    responsiveServiceSpy = jasmine.createSpyObj('ResponsiveService', [], {
      isMobile: signal(false),
    });
    destroyRefSpy = jasmine.createSpyObj('DestroyRef', ['onDestroy']);

    await TestBed.configureTestingModule({
      imports: [SongDialogComponent, NoopAnimationsModule, ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: null }, // Start with null for add mode
        { provide: SongsService, useValue: songsServiceSpy },
        { provide: ResponsiveService, useValue: responsiveServiceSpy },
        { provide: DestroyRef, useValue: destroyRefSpy },
        provideNativeDateAdapter(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SongDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form creation and validation', () => {
    it('should create a form with title, artist, releaseDate, and price controls', () => {
      expect(component.songForm.contains('title')).toBeTruthy();
      expect(component.songForm.contains('artist')).toBeTruthy();
      expect(component.songForm.contains('releaseDate')).toBeTruthy();
      expect(component.songForm.contains('price')).toBeTruthy();
    });

    it('should mark title as required', () => {
      const control = component.songForm.get('title');
      control?.setValue('');
      expect(control?.valid).toBeFalsy();
      expect(getFormControlError('title', 'required')).toBeTruthy();
    });

    it('should mark artist as required', () => {
      const control = component.songForm.get('artist');
      control?.setValue('');
      expect(control?.valid).toBeFalsy();
      expect(getFormControlError('artist', 'required')).toBeTruthy();
    });

    it('should mark releaseDate as required', () => {
      const control = component.songForm.get('releaseDate');
      control?.setValue(null);
      expect(control?.valid).toBeFalsy();
      expect(getFormControlError('releaseDate', 'required')).toBeTruthy();
    });

    it('should mark price as required', () => {
      const control = component.songForm.get('price');

      // Test required
      control?.setValue(null);
      expect(control?.valid).toBeFalsy();
      expect(getFormControlError('price', 'required')).toBeTruthy();

      // Valid value
      control?.setValue(0.99);
      expect(control?.valid).toBeTruthy();
    });

    it('should validate the entire form', () => {
      // Invalid form (empty)
      expect(component.songForm.valid).toBeFalsy();

      // Valid form
      setFormValues('Test Song', 'Test Artist', new Date(), 0.99);
      expect(component.songForm.valid).toBeTruthy();
    });
  });

  describe('Dialog initialization', () => {
    it('should initialize with empty form when adding a new song', () => {
      // Already created in beforeEach with null data (add mode)
      expect(component.songForm.value).toEqual({
        title: '',
        artist: '',
        releaseDate: null,
        price: null,
      });
    });

    it('should initialize form with song data when editing', async () => {
      // Create test song
      const testSong = new Song(
        1,
        'Test Title',
        'Test Artist',
        new Date('2023-01-01'),
        1.99,
      );

      // Re-create component with song data
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          SongDialogComponent,
          NoopAnimationsModule,
          ReactiveFormsModule,
        ],
        providers: [
          { provide: MatDialogRef, useValue: dialogRefSpy },
          { provide: MAT_DIALOG_DATA, useValue: testSong }, // Provide song directly
          { provide: SongsService, useValue: songsServiceSpy },
          { provide: ResponsiveService, useValue: responsiveServiceSpy },
          { provide: DestroyRef, useValue: destroyRefSpy },
          provideNativeDateAdapter(),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SongDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Expect form to be initialized with the song data
      expect(component.songForm.get('title')?.value).toBe('Test Title');
      expect(component.songForm.get('artist')?.value).toBe('Test Artist');
      expect(component.songForm.get('price')?.value).toBe(1.99);
      expect(component.songForm.get('releaseDate')?.value).toBeInstanceOf(Date);
    });
  });

  describe('Dialog actions', () => {
    it('should not submit if the form is invalid', () => {
      // Invalid form
      component.songForm.setValue({
        title: '',
        artist: '',
        releaseDate: null,
        price: null,
      });

      component.onSubmit();
      expect(songsServiceSpy.addSong).not.toHaveBeenCalled();
      expect(songsServiceSpy.updateSong).not.toHaveBeenCalled();
    });

    it('should submit a new song when adding', fakeAsync(() => {
      // Set valid form values
      setFormValues('New Song', 'New Artist', new Date('2023-01-01'), 1.99);

      // Submit the form
      component.onSubmit();
      tick();

      // Check that songsService.addSong was called with a song object
      expect(songsServiceSpy.addSong).toHaveBeenCalled();
      const calledArg = songsServiceSpy.addSong.calls.first().args[0];

      expect(calledArg.title).toBe('New Song');
      expect(calledArg.artist).toBe('New Artist');
      expect(calledArg.price).toBe(1.99);
      expect(calledArg.releaseDate).toEqual(new Date('2023-01-01'));

      // Check that dialog was closed after successful operation
      expect(dialogRefSpy.close).toHaveBeenCalled();
    }));

    it('should submit with existing id when editing a song', fakeAsync(() => {
      // Set up the component in edit mode
      const testSong = new Song(
        42, // Specific ID to test
        'Original Title',
        'Original Artist',
        new Date('2022-02-02'),
        0.99,
      );

      // Apply the edited song data to the component
      component.song = testSong;

      // Change some values
      setFormValues(
        'Edited Title',
        'Edited Artist',
        new Date('2023-03-03'),
        2.99,
      );

      // Submit the form
      component.onSubmit();
      tick();

      // Check that songsService.updateSong was called with the updated song
      expect(songsServiceSpy.updateSong).toHaveBeenCalled();
      const calledArg = songsServiceSpy.updateSong.calls.first().args[0];

      expect(calledArg.id).toBe(42); // Should keep the original ID
      expect(calledArg.title).toBe('Edited Title');
      expect(calledArg.artist).toBe('Edited Artist');
      expect(calledArg.price).toBe(2.99);

      // Check that dialog was closed after successful operation
      expect(dialogRefSpy.close).toHaveBeenCalled();
    }));
  });

  describe('UI elements', () => {
    it('should have a form with submit and cancel buttons', () => {
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      expect(buttons.length).toBeGreaterThan(1); // At least two buttons

      // Find the submit button (it should be the one with type="submit")
      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]'),
      );
      expect(submitButton).toBeTruthy();

      // Find the cancel button
      const cancelButton = fixture.debugElement.query(
        By.css('button[mat-dialog-close]'),
      );
      expect(cancelButton).toBeTruthy();
    });

    it('should call onSubmit when form is submitted', () => {
      spyOn(component, 'onSubmit');

      // Get the form element and dispatch a submit event
      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('submit', null);

      expect(component.onSubmit).toHaveBeenCalled();
    });
  });
});
