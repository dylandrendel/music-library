import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongsManagerComponent } from './songs-manager.component';
import { SongsService } from '../../services/songs.service';
import { ResponsiveService } from '../../services/responsive.service';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Song } from '../../models/song.model';
import { signal } from '@angular/core';
import { DateFilterComparison } from '../date-filter/date-filter.component';

describe('SongsManagerComponent', () => {
  let component: SongsManagerComponent;
  let fixture: ComponentFixture<SongsManagerComponent>;
  let songsServiceMock: jasmine.SpyObj<SongsService>;
  let dialogMock: jasmine.SpyObj<MatDialog>;
  let responsiveServiceMock: jasmine.SpyObj<ResponsiveService>;

  beforeEach(async () => {
    // Create mock services
    const mockSongsService = jasmine.createSpyObj(
      'SongsService',
      ['deleteSong'],
      {
        filteredSongs: signal([
          new Song(1, 'Test Song', 'Test Artist', new Date(), 1.99),
        ]),
        loadingSongs: signal(false),
        updating: signal(false),
        dateFilter: signal(null),
        dateFilterMode: signal<DateFilterComparison>('matching'),
      },
    );

    const mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    const mockResponsiveService = jasmine.createSpyObj(
      'ResponsiveService',
      [],
      {
        isMobile: signal(false),
      },
    );

    await TestBed.configureTestingModule({
      imports: [SongsManagerComponent, NoopAnimationsModule],
      providers: [
        { provide: SongsService, useValue: mockSongsService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ResponsiveService, useValue: mockResponsiveService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SongsManagerComponent);
    component = fixture.componentInstance;
    songsServiceMock = TestBed.inject(
      SongsService,
    ) as jasmine.SpyObj<SongsService>;
    dialogMock = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    responsiveServiceMock = TestBed.inject(
      ResponsiveService,
    ) as jasmine.SpyObj<ResponsiveService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with songs from the service', () => {
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].title).toBe('Test Song');
  });

  describe('deleteSong', () => {
    it('should call songsService.deleteSong when a song is deleted', () => {
      // Arrange
      const song = new Song(1, 'Test Song', 'Test Artist', new Date(), 1.99);
      songsServiceMock.deleteSong.and.returnValue(of(song));

      // Act
      component.deleteSong(song);

      // Assert
      expect(songsServiceMock.deleteSong).toHaveBeenCalledWith(song);
    });
  });
});
