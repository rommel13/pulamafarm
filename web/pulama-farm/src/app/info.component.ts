import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  standalone: true,
  selector: 'farm-info',
  templateUrl: './info.component.html',
})
export class InfoComponent {
  readonly apiUrl = environment.apiUrl;
}