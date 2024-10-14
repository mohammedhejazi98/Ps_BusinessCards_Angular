import { Routes } from '@angular/router';
import { BusinessCardComponent } from './business-card/business-card.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: BusinessCardComponent,
    data: {
      title: 'Starter Page',
    },
  }
];
