import { Component, Inject, Input, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { BusinessCardsService } from "src/app/services/businessCards.service";
import { DatePipe } from '@angular/common';
import { DomSanitizer } from "@angular/platform-browser";
import { BusinessCard } from "src/app/models/BusinessCard ";



@Component({
  selector: 'app-users-Dialog',
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

  userForm!: UntypedFormGroup;
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
  disableTap: boolean = false;
  ngOnInit(): void {
    this.userForm = this.formbuider.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.required],
      dateOfBirth: [null],
      address: [''],
      photoBase64: [''],
    })
    if (this.editData) {
      this.actionBtn = "Update";
      this.title = "Update Business Card";
      this.imageSrc = this.editData.photoBase64;
      this.imageBase64 = this.editData.photoBase64;
      this.originalUserAvatar = this.editData.photoBase64;

      this.userForm.controls['name'].setValue(this.editData.name);
      this.userForm.controls['phone'].setValue(this.editData.phone);
      this.userForm.controls['email'].setValue(this.editData.email);
      this.userForm.controls['address'].setValue(this.editData.address);
      this.userForm.controls['gender'].setValue(this.editData.gender);
      this.userForm.controls['dateOfBirth'].setValue(this.editData.dateOfBirth);
      this.userForm.controls['photoBase64'].setValue(this.editData.photoBase64);
      this.columnHidden = true;
      this.loaded = true
    } else {
      this.loaded = true
    }


  }
  addUser() {

    if (!this.editData) {
      const bsCard: BusinessCard = this.userForm.getRawValue();
      const day = new DatePipe('en-US').transform(bsCard.dateOfBirth, 'yyyy-MM-dd')?.toString();

      const formData = new FormData();
      formData.append('Email', bsCard.email)
      formData.append('Name', bsCard.name)
      formData.append('Phone', bsCard.phone)
      formData.append('Gender', bsCard.gender)
      formData.append('Address', bsCard.address)
      formData.append('DateOfBirth', day!)
      formData.append('image', this.imageBase64 || '')

      if (this.userForm.valid) {
        this.businessCardsService.create(formData).subscribe({
          next: (res) => {
            this.userForm.reset();
            this.dialogRef.close('Save');
          }
        })
      }

    } else {
      this.updateUser();
    }
  }

  updateUser() {
    const bsCard: BusinessCard = this.userForm.getRawValue();
    const day = new DatePipe('en-US').transform(bsCard.dateOfBirth, 'yyyy-MM-dd')?.toString();

    bsCard.dateOfBirth = day!;
    bsCard.photoBase64 = this.imageBase64 || null;
    bsCard.id = this.editData.id!;

    this.businessCardsService.updateBusinessCard(bsCard, this.editData.id).subscribe({
      next: (res) => {
        this.userForm.reset();
        this.dialogRef.close('Update');
      }
    })
  }

  onCheckboxChange(event: any) {
    // return event.target.val
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
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




