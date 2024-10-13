import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-blog-section-dialog',
  templateUrl: './blog-section-dialog.component.html',
  styleUrl: './blog-section-dialog.component.scss'
})
export class BlogSectionDialogComponent implements OnInit {

  form: FormGroup | any;
  order: number | 1 | undefined;
  contentEn: string | '' | undefined;
  contentAr: string | '' | undefined;
  images: [] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BlogSectionDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any) {

    this.order = data.order;
    this.contentEn = data.contentEn;
    this.contentAr = data.contentAr;
  }

  ngOnInit() {
    this.form = this.fb.group({
      contentEn: [this.contentEn, []],
      contentAr: [this.contentAr, []],
      order: [this.order, []],
      images: [this.images, []],
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
