import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment.hml";
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from "rxjs";
import { Product } from "./models/GetProductModel";
import { PaginatedResponse } from "../../shared/PaginatedReponseModel";
import { CreateProductModel } from "./models/CreateProductModel";
import { Helpers } from "../../shared/Helpers";
import { UUID } from "crypto";

@Injectable({
    providedIn: 'root'
})

export class ProductService{
    private apiUrl = enviroment.productApiUrl

    constructor(private httpClient: HttpClient){}

    getProductsAsync(page:number, size:Number):Observable<PaginatedResponse<Product[]>>{
        return this.httpClient.get<PaginatedResponse<Product[]>>(`${this.apiUrl}?page=${page}&size=${size}`)
    }

    createProductAsync(model: CreateProductModel):Observable<HttpEvent<any>> {

        const form = Helpers.toFormData(model)

        const req = new HttpRequest('POST', this.apiUrl, form, {
            reportProgress: true
        });

        return this.httpClient.request(req);
    }

    removeProductAsync(id:string):Observable<HttpEvent<any>>{

        const request = new HttpRequest('DELETE', `${this.apiUrl}/${id}`)
        return this.httpClient.request(request);
    }
}