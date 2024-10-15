import { Component, inject, Inject, Input, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { BusinessCardsService } from "src/app/services/businessCards.service";
import { DatePipe } from '@angular/common';
import { DomSanitizer } from "@angular/platform-browser";
import { BusinessCard } from "src/app/models/BusinessCard ";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";



@Component({
  selector: 'app-Dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  providers: [provideNativeDateAdapter()],

})
export class DialogComponent implements OnInit {
  fileName = '';

  uploadProgress: number | undefined;
  uploadSub: Subscription | undefined;
  disabled: boolean = true;
  gender: any[] = [{
    name: 'Male'
  },
  {
    name: 'Female'
  }];


  countries: any[] = []
  roles: any[] = []
  assignedRoles: any[] = []
  showDeleteDialog = false;
  bsCardForm!: UntypedFormGroup;
  actionBtn: string = "Save";
  title: string = "Add Business Card";
  imageSrc: any | ArrayBuffer | null | undefined;
  imageBase64: string | null = '';
  originalUserAvatar: any | ArrayBuffer | undefined;
  avatar: File | undefined;
  columnHidden: boolean = false;
  loaded: boolean = false


  constructor(private formbuider: UntypedFormBuilder
    , private businessCardsService: BusinessCardsService


    , private dialogRef: MatDialogRef<DialogComponent>
    , @Inject(MAT_DIALOG_DATA) public editData: BusinessCard, private sanitizer: DomSanitizer) {

  }
  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  disableTap: boolean = false;
  ngOnInit(): void {
    if (this.dialogRef.id !== '0') {
      this.showDeleteDialog = true;

      this.title = this.editData.name
    } else {

      this.bsCardForm = this.formbuider.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        gender: ['', Validators.required],
        phone: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        address: [''],
        photoBase64: [''],
      })
      if (this.editData) {
        this.actionBtn = "Update";
        this.title = "Update Business Card";
        this.imageSrc = this.editData.photoBase64;
        this.imageBase64 = this.editData.photoBase64;
        this.originalUserAvatar = this.editData.photoBase64;

        this.bsCardForm.controls['name'].setValue(this.editData.name);
        this.bsCardForm.controls['phone'].setValue(this.editData.phone);
        this.bsCardForm.controls['email'].setValue(this.editData.email);
        this.bsCardForm.controls['address'].setValue(this.editData.address);
        this.bsCardForm.controls['gender'].setValue(this.editData.gender);
        this.bsCardForm.controls['dateOfBirth'].setValue(this.editData.dateOfBirth);
        this.bsCardForm.controls['photoBase64'].setValue(this.editData.photoBase64);
        this.columnHidden = true;
        this.loaded = true
      } else {
        this.loaded = true
      }
    }



  }
  addBusinessCard() {

    if (!this.editData) {
      if (!this.bsCardForm.valid) {
        this._snackBar.open("Please fill all required field.", 'Done', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5000
        });
        return;
      }

      const bsCard: BusinessCard = this.bsCardForm.getRawValue();
      const day = new DatePipe('en-US').transform(bsCard.dateOfBirth, 'yyyy-MM-dd')?.toString();

      const formData = new FormData();
      formData.append('Email', bsCard.email)
      formData.append('Name', bsCard.name)
      formData.append('Phone', bsCard.phone)
      formData.append('Gender', bsCard.gender)
      formData.append('Address', bsCard.address)
      formData.append('DateOfBirth', day!)
      formData.append('PhotoBase64', this.imageBase64 || '')

      this.businessCardsService.create(formData).subscribe({
        next: () => {
          this._snackBar.open("Business card fetched successfully.", 'Done', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 5000
          });
          this.bsCardForm.reset();
          this.dialogRef.close('Save');
        },
        error(err) {

        },
      })


    } else {
      this.updateBusinessCard();
    }
  }

  updateBusinessCard() {
    debugger
    if (!this.bsCardForm.valid) {
      this._snackBar.open("Please fill all required field.", 'Done', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 5000
      });
      return;
    }
    const bsCard: BusinessCard = this.bsCardForm.getRawValue();
    const day = new DatePipe('en-US').transform(bsCard.dateOfBirth, 'yyyy-MM-dd')?.toString();

    bsCard.dateOfBirth = day!;
    bsCard.photoBase64 = this.imageBase64 || null;
    bsCard.id = this.editData.id!;
    debugger
    this.businessCardsService.updateBusinessCard(bsCard, this.editData.id).subscribe({
      next: () => {
        this._snackBar.open("Business card updated successfully.", 'Done', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5000
        });
        this.bsCardForm.reset();
        this.dialogRef.close('Update');
      },
      error(err) {

      },
    })
  }
  deleteBusinesscard(action: string) {
    this.dialogRef.close(action);
  }
  onCheckboxChange(event: any) {
    // return event.target.val
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file.size > 1000000) {
      this._snackBar.open("Max image size 1mp.", 'Done', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 5000
      });
      return
    }

    if (file) {
      this.fileName = file.name;

      const reader = new FileReader();
      reader.onload = e => {
        this.imageSrc = reader.result
        this.imageBase64 = reader.result as string
      };
      this.avatar = file;
      reader.readAsDataURL(file);
      this.disabled = false;

    }

  }
  onCancel() {
    this.imageSrc = null;
    this.imageBase64 = null;
    // this.fileName = null;
  }
}




