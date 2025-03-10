import { Component } from '@angular/core';
import { SongsManagerComponent } from './components/songs-manager/songs-manager.component';

@Component({
  selector: 'app-root',
  imports: [SongsManagerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'music-library';
}
