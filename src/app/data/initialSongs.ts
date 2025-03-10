import { Song } from '../models/song.model';

export const initialSongs: Song[] = [
  new Song(1, 'Bohemian Rhapsody', 'Queen', new Date('1975-10-31'), 1.29),
  new Song(2, 'Billie Jean', 'Michael Jackson', new Date('1983-01-02'), 0.99),
  new Song(
    3,
    'Smells Like Teen Spirit',
    'Nirvana',
    new Date('1991-09-10'),
    1.19,
  ),
  new Song(4, 'Hey Jude', 'The Beatles', new Date('1968-08-26'), 1.09),
  new Song(
    5,
    'Like A Rolling Stone',
    'Bob Dylan',
    new Date('1965-07-20'),
    0.89,
  ),
];
