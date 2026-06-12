import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home.component';

@Component({
  standalone: true,
  selector: 'farm-root',
  imports: [RouterOutlet, HomeComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('pulama-farm');
}
