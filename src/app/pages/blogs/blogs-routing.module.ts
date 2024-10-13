import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogListComponent } from './blog-list/blog-list.component';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { BlogsComponent } from './blogs.component';

const routes: Routes = [
  {
    path: '',
    component: BlogsComponent,
    children: [
      {
        path: 'blogs',
        component: BlogListComponent,
      },
      {
        path: 'blogs-list',
        component: BlogListComponent,
      },
      {
        path: 'create',
        component: CreateBlogComponent,
      },
    ],
  },
];

// const routes: Routes = [
//   {
//     path: 'blog-list',
//     component: BlogListComponent,
//   },
//   {
//     path: 'create',
//     component: CreateBlogComponent,
//   }
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule { }
