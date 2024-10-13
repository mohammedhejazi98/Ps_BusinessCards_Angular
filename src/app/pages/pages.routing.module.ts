import { Routes } from '@angular/router';
import { BlogsComponent } from './blogs/blogs.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: BlogsComponent,
    data: {
      title: 'Starter Page',
    },
  }
];
