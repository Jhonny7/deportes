import { Component } from '@angular/core';
import { MenuController, NavController, ModalController, PopoverController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UtilService } from 'src/services/util-service/util.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { AlertaService } from 'src/services/alerta-service/alerta.service';
import { GenericService } from 'src/services/generic-service/generic-service.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { JugadorModel } from 'src/models/JugadorModel';
import { CrudJugadorPage } from '../crud-jugador/crud-jugador.page';
import { EstadisticaModel } from 'src/models/EstadisticaModel';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public usuario: any;
  public jugadores: JugadorModel[] = [];

  public jugador: JugadorModel;

  constructor(
    private menuCtrl: MenuController,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private spinnerDialog: SpinnerDialog,
    private genericService: GenericService,
    private alertaService: AlertaService,
    private modalController: ModalController,
    private router: Router,
    public popoverController: PopoverController,
    public alertCtrl: AlertController
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

  ionRefresh(event) {
    setTimeout(() => {
      //complete()  signify that the refreshing has completed and to close the refresher
      event.target.complete();
      this.chargePlayers();
    }, 3000);
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: HomePage,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  chargePlayers() {
    this.spinnerDialog.show(UtilService.mensajeCarga);
    this.jugadores = [];
    this.genericService.get("jugadores/getPlayers", new HttpParams()).subscribe((res: any) => {
      console.log(res);
      if (res.status == "A") {
        res.parameters.forEach(jugador => {
          this.jugadores.push(new JugadorModel(jugador.id_jugador, jugador.nombreCompleto, jugador.fotografia, jugador.rama));
        });
      } else {
        this.alertaService.warnAlert(this.genericService.headerValidacion, res.description, null);
      }
      this.spinnerDialog.hide();
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.spinnerDialog.hide();
      this.alertaService.errorAlert(this.genericService.headerError, err.error.description + " ,puedes deslizar hacia abajo y actualizar", null);
    });
  }

  editar(jugador: JugadorModel) {
    this.jugador = jugador;
    this.openCrud(0);
  }

  async eliminar(jugador: JugadorModel) {
    const confirm = await this.alertCtrl.create({
      header: "Confirmación",
      message: "¿Estás seguro de eliminar el jugador?, recuerda que se perderá toda la información relacionada con él (ella)",
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.eliminarJugador(jugador);
          }
        }
      ]
    });
    return await confirm.present();
  }

  eliminarJugador(jugador: JugadorModel) {
    this.jugador = jugador;
    this.spinnerDialog.show(UtilService.mensajeCarga);
    let params = {
      idJugador: jugador.id
    };
    this.genericService.post("jugadores/deletePlayer", JSON.stringify(params)).subscribe((res: any) => {
      console.log(res);
      if (res.status == "A") {
        this.removeitem(jugador);
      } else {
        this.alertaService.warnAlert(this.genericService.headerValidacion, res.description, null);
      }
      this.spinnerDialog.hide();
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.spinnerDialog.hide();
      this.alertaService.errorAlert(this.genericService.headerError, err.error.description, null);
    });
  }

  removeitem(j: JugadorModel) {
    const index = this.jugadores.findIndex(jugador => jugador.id == j.id);
    this.jugadores.splice(index, 1);
  }

  async openModalEdit(jugador: any) {
    let modal;
    modal = await this.modalController.create({
      component: CrudJugadorPage,
      componentProps: {
        type: "Editar",
        jugador: jugador
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      console.log(data.data);
      this.spinnerDialog.show(UtilService.mensajeCarga);
      let num: number = data.data.data;
      console.log(num);
      if (num == 1) {
        this.chargePlayers();
        this.spinnerDialog.hide();
      } else {
        console.log("Data null");
      }
    });
    return await modal.present();
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
      modal.onDidDismiss().then((data) => {
        console.log(data);
        console.log(data.data);
        this.spinnerDialog.show(UtilService.mensajeCarga);
        let num: number = data.data.data;
        console.log(num);
        if (num == 1) {
          this.chargePlayers();
          this.spinnerDialog.hide();
        } else {
          console.log("Data null");
        }
      });
      return await modal.present();
    } else {
      //Editar usuario
      this.spinnerDialog.show(UtilService.mensajeCarga);
      let params = new HttpParams();
      params = params.append('id', this.jugador.id.toString());
      this.genericService.get("jugadores/getPlayerById", params).subscribe((res: any) => {
        console.log(res);
        if (res.status == "A") {
          this.openModalEdit(res.parameters);
        } else {
          this.alertaService.warnAlert(this.genericService.headerValidacion, res.description, null);
        }
        this.spinnerDialog.hide();
      }, (err: HttpErrorResponse) => {
        console.log(err);
        this.spinnerDialog.hide();
        this.alertaService.errorAlert(this.genericService.headerError, err.error.description + " ,puedes deslizar hacia abajo y actualizar", null);
      });
    }
  }

  openData(jugador: JugadorModel) {
    this.spinnerDialog.show(UtilService.mensajeCarga);
    let params = new HttpParams();
    params = params.append('id', jugador.id.toString());
    this.genericService.get("jugadores/getPlayerById", params).subscribe((res: any) => {
      console.log(res);
      if (res.status == "A") {
        let paramsE = new HttpParams();
        let datosJ = res.parameters;
        paramsE = paramsE.append('idJugador', datosJ.id.toString());
        
        let jugadorData: JugadorModel = new JugadorModel(
          datosJ.id,
          datosJ.nombre,
          datosJ.fotografia,
          datosJ.rama,
          datosJ.apellido_paterno,
          datosJ.apellido_materno,
          datosJ.idLevel,
          datosJ.level,
          datosJ.sale
        );

        this.genericService.get("estadisticas/getGeneralStatisticsByPlayer", paramsE).subscribe((data: any) => {
          if (data.status == "A") {
            let datosE = data.parameters;
            console.log(datosE);
            let estadisticaGral: EstadisticaModel;
            if(datosE.touch_pass != null){
              estadisticaGral = new EstadisticaModel(
                0,datosE.touch_pass,datosE.annotation_by_race,datosE.annotation_by_pass,datosE.interceptions,datosE.sachs,datosE.conversions
              );
            }else{
              estadisticaGral = new EstadisticaModel();
            }
            
            console.log(jugadorData);
            this.spinnerDialog.hide();
            this.router.navigate(["/jugador",{estadisticas : JSON.stringify(estadisticaGral), jugador: JSON.stringify(jugadorData)}]);
          } else {
            this.alertaService.warnAlert(this.genericService.headerValidacion, data.description, null);
          }
          this.spinnerDialog.hide();
        }, (err: HttpErrorResponse) => {
          console.log(err);
          this.spinnerDialog.hide();
          this.alertaService.errorAlert(this.genericService.headerError, err.error.description + " ,puedes deslizar hacia abajo y actualizar", null);
        });
      } else {
        this.alertaService.warnAlert(this.genericService.headerValidacion, res.description, null);
      }
      this.spinnerDialog.hide();
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.spinnerDialog.hide();
      this.alertaService.errorAlert(this.genericService.headerError, err.error.description + " ,puedes deslizar hacia abajo y actualizar", null);
    });
  }
}
