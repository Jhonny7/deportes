import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public static mensajeCarga: string = "Cargando...";

  constructor() { }

  public objIsEmpty(objet: any) {
    for (var prop in objet) {
      if (objet.hasOwnProperty(prop))
        return false;
    }
    return JSON.stringify(objet) === JSON.stringify({});
  }
}
