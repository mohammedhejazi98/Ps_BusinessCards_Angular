import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Router } from '@angular/router';
import { startWith, switchMap, catchError, map } from 'rxjs';
import { merge, Observable, of as observableOf } from 'rxjs';
import { BusinessCardsService } from 'src/app/services/businessCards.service';
import { ChangeDetectionStrategy, inject, model, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateBlogComponent } from '../create-blog/create-blog.component';


@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',

})

export class BlogListComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'email', 'dateOfBirth', 'gender', 'phone'];
  data: any[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  searchText = '';



  readonly dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateBlogComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger
      console.log('The dialog was closed');
      this.getBusinessCards2();
    });
  }




  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private _httpClient: HttpClient, public router: Router, private businessCardsService: BusinessCardsService) { }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;

          return this.getBusinessCards(
            this.sort.active + " " + this.sort.direction,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.searchText
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.length;
          return data;
        }),
      )
      .subscribe(data => (this.data = data));


  }

  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;

          return this.getBusinessCards(
            this.sort.active + " " + this.sort.direction,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.searchText
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.payload.totalRows;
          return data.payload.items;
        }),
      )
      .subscribe(data => (this.data = data));
    // alert(this.searchText)
  }
  getRecord(event: any) {
    this.router.navigate(['blogs/create']);
  }


  getBusinessCards(sort: string, order: SortDirection, page: number, rowPerPage: number, search: string): Observable<any> {
    return this.businessCardsService.getBusinessCards();
  }
  getBusinessCards2(): Observable<any> {
    return this.businessCardsService.getBusinessCards();
  }
}
