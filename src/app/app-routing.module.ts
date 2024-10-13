import { BlogsModule } from './pages/blogs/blogs.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { BlogsComponent } from './pages/blogs/blogs.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/blogs/blogs-list',
        pathMatch: 'full',
      },
      {

        path: 'blogs',
        loadChildren: () =>
          import('./pages/blogs/blogs.module').then((m) => m.BlogsModule),

      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
