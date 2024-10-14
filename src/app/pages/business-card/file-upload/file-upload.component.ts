import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { BusinessCardsService } from 'src/app/services/businessCards.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  disabled = false;
  files: File[] = [];
  constructor(private service: BusinessCardsService, private dialogRef: MatDialogRef<FileUploadComponent>) {

  }
  onSelect(event: any) {
    debugger
    console.log(event);
    this.disabled = true;
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  remove() {
    this.files = [];
    this.disabled = false
  }
  import() {
    debugger
    if (this.files.length === 0) {
      console.log('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('FileUpload', this.files[0], this.files[0].name);
    formData.append('Name', 'test');
    formData.append('Phone', '000000000');
    formData.append('Gender', 'test');

    this.service.create(formData).subscribe(
      response => {
        this._snackBar.open(response.message, 'Done', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5000
        })
        this.remove();  // Reset the file list after successful upload
        this.dialogRef.close();
      },
      error => {
        this._snackBar.open(error.error, 'Done', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5000
        })
      }
    );
  }
}
