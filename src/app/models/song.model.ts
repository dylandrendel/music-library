export class Song {
  id: number;
  title: string;
  artist: string;
  releaseDate: Date;
  price: number;

  constructor(
    id: number,
    title: string,
    artist: string,
    releaseDate: Date,
    price: number
  ) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.releaseDate = releaseDate;
    this.price = price;
  }
}
