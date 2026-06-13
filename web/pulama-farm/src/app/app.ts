import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
  standalone: true,
  selector: 'farm-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('pulama-farm');
}
