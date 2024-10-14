import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BusinessCards } from '../pages/business-card/dialog/dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessCardsService {

  constructor(private httpClient: HttpClient) { }

  public create(bsCard: any) {

    return this.httpClient.post<any>(environment.apiUrl + "/BusinessCards/AddBusinessCard", bsCard)
  }
  public deleteBusinessCard(id: number) {
    return this.httpClient.delete<any>(environment.apiUrl + "/BusinessCards/DeleteBusinessCard?id=" + id)
  }

  public exportToExcel() {
    const apiUrl = environment.apiUrl + "/BusinessCards/ExportToExcel";

    return this.httpClient.get(apiUrl, { responseType: 'blob' });
  }
  public exportToXml() {
    const apiUrl = environment.apiUrl + "/BusinessCards/ExportToXml";

    return this.httpClient.get(apiUrl, { responseType: 'blob' });
  }
  public generateQr(id: number): Observable<Blob> {
    // Make an HTTP GET request to the backend API to generate the QR code
    const apiUrl = environment.apiUrl + "/BusinessCards/GenerateQr?id=" + id;
    return this.httpClient.get(apiUrl, { responseType: 'blob' });
  }
  public getBusinessCard(id: number) {
    return this.httpClient.get<any>(environment.apiUrl + "/BusinessCards/GetBusinessCard?id=" + id)
  }
  public getBusinessCards() {
    return this.httpClient.get<any>(environment.apiUrl + "/BusinessCards/GetBusinessCards")
  }
  public updateBusinessCard(bsCard: any, id: number) {
    return this.httpClient.put<any>(environment.apiUrl + "/BusinessCards/UpdateBusinessCard?id=" + id, bsCard)
  }



}
