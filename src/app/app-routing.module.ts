import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { BusinessCardComponent } from './pages/business-card/business-card.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/business-card/business-card-list',
        pathMatch: 'full',
      },
      {

        path: 'business-card',
        loadChildren: () =>
          import('./pages/business-card/business-card.module').then((m) => m.BusinessCardModule),

      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
