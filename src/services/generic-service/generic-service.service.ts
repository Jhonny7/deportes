import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GenericService {
  public pathService: String = "http://localhost:8080/api_deportes/";

  public headerError: string = "Error!";
  public mensajeError: string = "Verifica tu conexión y datos ó contacte al administrador";
  public headerValidacion: string = "Advertencia!";
  public headerExito: string = "Bien!";
  public mensajeValidacionAdmin: string = "Ha ocurrido un error en el servidor, contacte al administrador";
  public mensajeValidacionLogin: string = "Verifica tus credenciales";

  public timeOver: number = 10000;// 10 segundos de espera en servicios

  constructor(public http: HttpClient) { }

  /** Peticiones GET */
  public get(path: string, params: any) {
    console.log("**Petición GET**");
    let p = {
      params: params
    };
    return this.http.get(this.pathService + path, p);
  }

  public put(path: string, params: any) {
    console.log("**Petición PUT**");
    return this.http.put(this.pathService + path, { params });
  }

  public post(path: string, params: any) {
    console.log("**Petición POST**");
    return this.http.post(this.pathService + path, params);
  }

  public delete(path: string, params: any) {
    console.log("**Petición DELETE**");
    return this.http.delete(this.pathService + path, params);
  }
}
