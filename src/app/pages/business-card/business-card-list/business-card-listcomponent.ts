import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { BusinessCardsService } from 'src/app/services/businessCards.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs';
import { DialogComponent } from '../dialog/dialog.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-business-card-list',
  templateUrl: './business-card-list.component.html',
  styleUrl: './business-card-list.component.scss',

})

export class BusinessCardListComponent implements OnInit {
  title = 'Business Cards';
  user: any
  loaded: boolean = true
  displayedColumns: string[] = ['name', 'email', 'gender', 'phone', 'dateOfBirth', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private businessCardsService: BusinessCardsService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer

  ) {
    this.matIconRegistry.addSvgIcon(
      "excel",
      this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/svgs/excel.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "xml",
      this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/svgs/xml-svgrepo-com.svg")
    );

  }
  ngOnInit(): void {
    this.getBusinessCards();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '70vh',
      maxWidth: 'xl',
      height: '70%',
      id: '0'

    }).afterClosed().subscribe(val => {
      if (val == "Save") { this.getBusinessCards() }
    });

  }
  import() {
    this.dialog.open(FileUploadComponent, {
      width: '70%',
      maxWidth: 'xl',
      height: '90%',
    }).afterClosed().subscribe(() => {
      this.getBusinessCards()
    });

  }

  getBusinessCards() {
    return this.businessCardsService.getBusinessCards().subscribe({

      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loaded = true
      },
      error: (err) => {
        this.loaded = false
      }
    })
  }
  getBusinessCard(id: any): void {
    this.businessCardsService.getBusinessCard(id)
      .pipe(
        tap((data: any) => {
          this.dialog.open(DialogComponent, {
            width: '70vh',
            maxWidth: 'xl',
            height: '70%',
            data: data,
            id: '0'
          }).afterClosed().subscribe(val => {
            if (val == "Update") {
              this.getBusinessCards();  // Refresh the users
            }
          });
        })
      )
      .subscribe({
        error: err => {
          this.loaded = false;  // Handle errors
        }
      });
  }


  updateBusinessCard(row: any) {
    this.getBusinessCard(row.id)
  }
  deleteBusinesscard(row: any) {
    this.dialog.open(DialogComponent, {
      width: '70vh',
      maxWidth: 'xl',
      height: '35%',
      data: row,
      id: row.id
    }).afterClosed().subscribe(val => {
      if (val == "delete") {
        this.businessCardsService.deleteBusinessCard(row.id).subscribe({
          next: (res) => {
            this.getBusinessCards();
          }
        })
      }
    });

  }
  generateQr(row: any) {

    this.businessCardsService.generateQr(row.id).subscribe((blob) => {
      this.downloadBlob(blob, `${row.name}-Qr.png`);
    })
  }
  exportToExcel() {

    this.businessCardsService.exportToExcel().subscribe((blob) => {
      this.downloadBlob(blob, `BusinessCards.xlsx`);
    })
  }
  exportToXML() {

    this.businessCardsService.exportToXml().subscribe((blob) => {
      this.downloadBlob(blob, `BusinessCards.xml`);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  downloadBlob(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

