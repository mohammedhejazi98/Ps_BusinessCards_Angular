import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { BusinessCardsService } from 'src/app/services/businessCards.service';
import * as XLSX from 'xlsx';  // Import xlsx library
import jsQR from 'jsqr'; // Import the jsQR library for QR code reading


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  disabled = false;
  files: File[] = [];
  excelData: any[] = [];  // Array to store parsed Excel data
  xmlData: any[] = [];    // Array to store parsed XML data
  qrCodeData: any | null = null; // Store parsed QR code data in BusinessCards interface
  fileType: string = '';  // To store the type of file (XML, Excel, or QR)

  constructor(private service: BusinessCardsService, private dialogRef: MatDialogRef<FileUploadComponent>) { }

  onSelect(event: any) {

    if (event.addedFiles[0].size > 1000000) {// 1MB
      this._snackBar.open("Max file size 1MB", 'Done', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 5000
      });
      this.files = [];
      this.disabled = false;
      this.excelData = [];
      this.xmlData = [];
      this.qrCodeData = null;
      this.fileType = '';
      return;
    }
    console.log(event);
    this.disabled = true;
    this.files.push(...event.addedFiles);
    const file = this.files[0];

    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx')) {
      this.fileType = 'excel';
      this.readExcelFile(file);
    } else if (file.type === 'text/xml' || file.name.endsWith('.xml')) {
      this.fileType = 'xml';
      this.readXmlFile(file);
    } else if (file.type.startsWith('image/')) {
      this.fileType = 'qr';
      this.readQRCode(file);
    }
  }

  // Read QR code from image and parse it
  readQRCode(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const qrCode = jsQR(imageData.data, img.width, img.height);

        if (qrCode) {
          const qrData = qrCode.data;
          try {
            this.qrCodeData = JSON.parse(qrData);
            // Assuming QR code data is in JSON format
            console.log('Parsed QR Code Data:', this.qrCodeData);
          } catch (error) {
            console.error('Failed to parse QR code data:', error);
            this.qrCodeData = null;
          }
        } else {
          console.error('No QR code found in the image');
          this.qrCodeData = null;
        }
      };
      img.src = e.target.result;
    };
    fileReader.readAsDataURL(file);
  }

  // Read Excel file
  readExcelFile(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const binaryData = e.target.result;
      const workbook = XLSX.read(binaryData, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      this.excelData = XLSX.utils.sheet_to_json(sheet);  // Parse Excel data to JSON
      console.log(this.excelData);  // You can log to see the parsed data
    };
    fileReader.readAsBinaryString(file);
  }

  // Read XML file
  readXmlFile(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(e.target.result, 'application/xml');
      this.xmlData = this.parseXML(xml);
      console.log(this.xmlData);  // Check the parsed XML data
    };
    fileReader.readAsText(file);
  }

  parseXML(xml: Document) {
    const data: any[] = [];

    // Update 'item' to the actual parent node that contains multiple objects
    const items = xml.getElementsByTagName('BusinessCard');

    for (let i = 0; i < items.length; i++) {
      const obj: any = {};
      const children = items[i].childNodes;

      // Traverse through the child nodes of each item
      for (let j = 0; j < children.length; j++) {
        const node = children[j];
        if (node.nodeType === 1) {  // Process only element nodes
          obj[node.nodeName] = node.textContent?.trim();  // Add to object
        }
      }

      data.push(obj);  // Push the object to data array
    }
    return data;
  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  remove() {
    this.files = [];
    this.disabled = false;
    this.excelData = [];
    this.xmlData = [];
    this.qrCodeData = null;
    this.fileType = '';
  }

  import() {
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
        });
        this.remove();  // Reset the file list after successful upload
        this.dialogRef.close();
      },
      error => {
        this._snackBar.open(error.error, 'Done', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5000
        });
      }
    );
  }

  // Helper function to extract keys from JSON objects for displaying in a table
  getKeys(data: any) {
    return Object.keys(data);
  }
}
