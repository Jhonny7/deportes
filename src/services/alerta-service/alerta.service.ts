import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  constructor(public alertCtrl: AlertController) { }

  async alertaBasica(titulo: string, subtitulo: string, accion: any) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: subtitulo,
      cssClass: 'alertCustomCss',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            if(accion!=null){
              accion();
            }
          }
        }
      ]
    });
    return await alert.present();
  }

  async warnAlert(titulo: string, subtitulo: string, accion: any) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: subtitulo,
      cssClass: 'warnAlert',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            if(accion!=null){
              accion();
            }
          }
        }
      ]
    });
    return await alert.present();
  }

  async errorAlert(titulo: string, subtitulo: string, accion: any) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: subtitulo,
      cssClass: 'errorAlert',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            if(accion!=null){
              accion();
            }
          }
        }
      ]
    });
    return await alert.present();
  }

  async alertaConfirmacion(titulo: string, mensaje: string, accionAceptar: any, accionCancelar: any) {
    const confirm = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            if (accionCancelar != null) {
              accionCancelar();
            }
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            accionAceptar();
          }
        }
      ]
    });
    return await confirm.present();
  }

  async alertaInput(titulo: string, mensaje: string, accionAceptar: any, accionCancelar: any, inputsE: any[]) {
    const prompt = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      inputs: inputsE,
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            if (accionCancelar != null) {
              accionCancelar();
            }
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            accionAceptar();
          }
        }
      ]
    });
    return await prompt.present();
  }
}
