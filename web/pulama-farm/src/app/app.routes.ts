import { Routes } from '@angular/router';
import { OrderComponent } from './order.component';
import { HomeComponent } from './home.component';
import { InfoComponent } from './info.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'order', component: OrderComponent },
  { path: 'info', component: InfoComponent }
];
