import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessCardsService {

  constructor(private httpClient: HttpClient) { }

  public create() {

    return this.httpClient.post<any>(environment.apiUrl + "/BusinessCards/AddBusinessCard", {})
  }
  public deleteBusinessCard(id: number) {
    return this.httpClient.delete<any>(environment.apiUrl + "/BusinessCards/DeleteBusinessCard")
  }

  public exportToExcel() {
    return this.httpClient.get<any>(environment.apiUrl + "/BusinessCards/ExportToExcel")
  }
  public exportToXml() {
    return this.httpClient.get<any>(environment.apiUrl + "/BusinessCards/ExportToXml")
  }
  public generateQr() {
    return this.httpClient.get<any>(environment.apiUrl + "/BusinessCards/GenerateQr")
  }
  public getBusinessCard(id: number) {
    return this.httpClient.get<any>(environment.apiUrl + "/BusinessCards/GetBusinessCard")
  }
  public getBusinessCards() {
    return this.httpClient.get<any>(environment.apiUrl + "/BusinessCards/GetBusinessCards")
  }
  public updateBusinessCard() {
    return this.httpClient.put<any>(environment.apiUrl + "/BusinessCards/UpdateBusinessCard", {})
  }



}
