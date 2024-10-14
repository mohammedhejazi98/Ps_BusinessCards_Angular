import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessCardListComponent } from './business-card-list/business-card-listcomponent';
import { BusinessCardComponent } from './business-card.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessCardComponent,
    children: [
      {
        path: 'businessCard',
        component: BusinessCardListComponent,
      },
      {
        path: 'business-card-list',
        component: BusinessCardListComponent,
      }
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
export class BusinessCardRoutingModule { }
