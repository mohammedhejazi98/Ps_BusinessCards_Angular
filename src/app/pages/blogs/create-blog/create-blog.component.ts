import { Component, inject, model, signal, ViewChild } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { BlogSectionDialogComponent } from '../blog-section-dialog/blog-section-dialog.component';

export interface PageSection {
  contentAr: string;
  contentEn: string;
  order: number;
  images: [string]
}
export interface DialogData {
  animal: string;
  name: string;
}
const ELEMENT_DATA: PageSection[] = [];


@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrl: './create-blog.component.scss',
  providers: [provideNativeDateAdapter()],

})


export class CreateBlogComponent {

  constructor() { }

  readonly dialogRef = inject(MatDialogRef<CreateBlogComponent>);
  // readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  // readonly animal = model(this.data.animal);

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    console.log('hello');
    this.dialogRef.close();

  }

}


