import { Component } from '@angular/core';
import { MenuController, NavController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/services/util-service/util.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { AlertaService } from 'src/services/alerta-service/alerta.service';
import { GenericService } from 'src/services/generic-service/generic-service.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { JugadorModel } from 'src/models/JugadorModel';
import { CrudJugadorPage } from '../crud-jugador/crud-jugador.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public usuario: any;
  public jugadores: JugadorModel[] = [];

  constructor(
    private menuCtrl: MenuController,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private spinnerDialog: SpinnerDialog,
    private genericService: GenericService,
    private alertaService: AlertaService,
    private modalController: ModalController
  ) {
    this.route.params.subscribe((params: any) => {
      console.log(params);
      this.usuario = params;
      if (utilService.objIsEmpty(this.usuario)) {
        this.usuario = JSON.parse(localStorage.getItem("user"));
      }
      this.chargePlayers();
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  chargePlayers() {
    this.spinnerDialog.show(UtilService.mensajeCarga);
    this.genericService.get("jugadores/getPlayers", new HttpParams()).subscribe((res: any) => {
      console.log(res);
      this.spinnerDialog.hide();
    }, (err: HttpErrorResponse) => {
      this.spinnerDialog.hide();
      this.alertaService.errorAlert(this.genericService.headerError, err.error.description, null);
    });
  }

  async openCrud(type: number) {
    let modal;
    if (type == 1) {
      modal = await this.modalController.create({
        component: CrudJugadorPage,
        componentProps: {
          type: "Crear"
        }
      });
    } else {

    }
    modal.present();
    modal.onDidDismiss((data) => {
      this.spinnerDialog.show(UtilService.mensajeCarga);
      if (data != null) {

      } else {
        this.spinnerDialog.hide();
      }
    });
  }
}
