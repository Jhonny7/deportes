import { Component, OnInit } from '@angular/core';
import { EquipoModel } from 'src/models/EquipoModel';
import { UtilService } from 'src/services/util-service/util.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { GenericService } from 'src/services/generic-service/generic-service.service';
import { AlertaService } from 'src/services/alerta-service/alerta.service';
import * as moment from "moment";
import { AlertController, ModalController } from '@ionic/angular';
import { CrudEquipoPage } from '../crud-equipo/crud-equipo.page';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.page.html',
  styleUrls: ['./equipo.page.scss'],
})
export class EquipoPage {

  public equipos: EquipoModel[] = [];

  public equipo: EquipoModel;

  constructor(
    private spinnerDialog: SpinnerDialog,
    private genericService: GenericService,
    private alertaService: AlertaService,
    public alertCtrl: AlertController,
    private modalController: ModalController
  ) {
    this.chargeTeams();
  }

  ionRefresh(event) {
    setTimeout(() => {
      //complete()  signify that the refreshing has completed and to close the refresher
      event.target.complete();
      this.chargeTeams();
    }, 3000);
  }

  chargeTeams() {
    this.spinnerDialog.show(UtilService.mensajeCarga);
    this.equipos = [];
    this.genericService.get("equipos/getTeams", new HttpParams()).subscribe((res: any) => {
      console.log(res);
      let parametros = res.parameters;
      parametros.forEach(equipo => {
        this.equipos.push(new EquipoModel(equipo.id, equipo.nombre, 0, 0, 0, 0, 0, 0, 0, 0, 0, false, equipo.fotografia, equipo.fecha));
      });
      this.spinnerDialog.hide();
    }, (err: HttpErrorResponse) => {
      console.log(err.error.description);
      this.spinnerDialog.hide();
      this.alertaService.errorAlert(this.genericService.headerError, err.error.description, null);
    });
  }

  returnFecha(equipo: EquipoModel) {
    if (equipo.fecha != null && equipo.fecha.length > 0) {
      moment.locale("ES");
      let fecha = moment(equipo.fecha).format("DD [de] MMMM, YYYY").toLowerCase();
      fecha = this.setCharAt(fecha, 6, fecha[6].toUpperCase());
      return fecha;
    } else {
      return "";
    }
  }

  setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
  }

  async eliminar(equipo: EquipoModel) {
    const confirm = await this.alertCtrl.create({
      header: "Confirmación",
      message: "¿Estás seguro de eliminar el equipo?, recuerda que se perderá toda la información relacionada con él, principalmente los jugadores asignados",
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.eliminarEquipo(equipo);
          }
        }
      ]
    });
    return await confirm.present();
  }

  eliminarEquipo(equipo: EquipoModel) {
    this.equipo = equipo;
    this.spinnerDialog.show(UtilService.mensajeCarga);
    let params = {
      idEquipo: equipo.id
    };
    this.genericService.post("equipos/deleteTeam", JSON.stringify(params)).subscribe((res: any) => {
      console.log(res);
      if (res.status == "A") {
        this.removeitem(equipo);
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

  removeitem(e: EquipoModel) {
    const index = this.equipos.findIndex(equipo => equipo.id == e.id);
    this.equipos.splice(index, 1);
  }

  editar(equipo: EquipoModel) {
    this.equipo = equipo;
    this.openCrud(0);
  }

  async openCrud(type: number) {
    let modal;
    if (type == 1) {
      modal = await this.modalController.create({
        component: CrudEquipoPage,
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
          this.chargeTeams();
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
      params = params.append('id', this.equipo.id.toString());
      this.genericService.get("equipos/getTeamById", params).subscribe((res: any) => {
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

  async openModalEdit(equipo: any) {
    let modal;
    modal = await this.modalController.create({
      component: CrudEquipoPage,
      componentProps: {
        type: "Editar",
        equipo: equipo
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      console.log(data.data);
      this.spinnerDialog.show(UtilService.mensajeCarga);
      let num: number = data.data.data;
      console.log(num);
      if (num == 1) {
        this.chargeTeams();
        this.spinnerDialog.hide();
      } else {
        console.log("Data null");
      }
    });
    return await modal.present();
  }
}
