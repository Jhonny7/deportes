import { Component, OnInit } from '@angular/core';
import { LevelModel } from 'src/models/LevelModel';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { GenericService } from 'src/services/generic-service/generic-service.service';
import { AlertaService } from 'src/services/alerta-service/alerta.service';
import { AlertController, ModalController } from '@ionic/angular';
import { UtilService } from 'src/services/util-service/util.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { CrudLevelPage } from '../crud-level/crud-level.page';

@Component({
  selector: 'app-level',
  templateUrl: './level.page.html',
  styleUrls: ['./level.page.scss'],
})
export class LevelPage implements OnInit {

  public niveles: LevelModel[] = [];

  public nivel: LevelModel;

  constructor(
    private spinnerDialog: SpinnerDialog,
    private genericService: GenericService,
    private alertaService: AlertaService,
    public alertCtrl: AlertController,
    private modalController: ModalController
  ) { 
    this.chargeLevels();
  }

  ionRefresh(event) {
    setTimeout(() => {
      //complete()  signify that the refreshing has completed and to close the refresher
      event.target.complete();
      this.chargeLevels();
    }, 3000);
  }

  chargeLevels() {
    this.spinnerDialog.show(UtilService.mensajeCarga);
    this.niveles = [];
    this.genericService.get("level/getLevels", new HttpParams()).subscribe((res: any) => {
      console.log(res);
      let parametros = res.parameters;
      parametros.forEach(level => {
        this.niveles.push(new LevelModel(level.id,level.level));
      });
      this.spinnerDialog.hide();
    }, (err: HttpErrorResponse) => {
      console.log(err.error.description);
      this.spinnerDialog.hide();
      this.alertaService.errorAlert(this.genericService.headerError, err.error.description, null);
    });
  }

  ngOnInit() {
  }

  async eliminar(nivel: LevelModel) {
    const confirm = await this.alertCtrl.create({
      header: "Confirmación",
      message: "¿Estás seguro de eliminar el nivel?, recuerda que algunos jugadores tienen ese nivel, te sugerimos crear uno nuevo y asignarlos antes de eliminar",
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.eliminarNivel(nivel);
          }
        }
      ]
    });
    return await confirm.present();
  }

  eliminarNivel(nivel: LevelModel) {
    this.nivel = nivel;
    this.spinnerDialog.show(UtilService.mensajeCarga);
    let params = {
      idEquipo: nivel.id
    };
    this.genericService.post("level/deleteLevel", JSON.stringify(params)).subscribe((res: any) => {
      console.log(res);
      if (res.status == "A") {
        this.removeitem(nivel);
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

  removeitem(n: LevelModel) {
    const index = this.niveles.findIndex(nivel => nivel.id == n.id);
    this.niveles.splice(index, 1);
  }

  editar(nivel: LevelModel) {
    this.nivel = nivel;
    this.openCrud(0);
  }

  async openCrud(type: number) {
    let modal;
    if (type == 1) {
      modal = await this.modalController.create({
        component: CrudLevelPage,
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
          this.chargeLevels();
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
      params = params.append('id', this.nivel.id.toString());
      this.genericService.get("level/getLevelById", params).subscribe((res: any) => {
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
      component: CrudLevelPage,
      componentProps: {
        type: "Editar",
        nivel: nivel
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      console.log(data.data);
      this.spinnerDialog.show(UtilService.mensajeCarga);
      let num: number = data.data.data;
      console.log(num);
      if (num == 1) {
        this.chargeLevels();
        this.spinnerDialog.hide();
      } else {
        console.log("Data null");
      }
    });
    return await modal.present();
  }
}
