import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { AlertController } from '@ionic/angular';
import { EquipoModel } from 'src/models/EquipoModel';
import { EstadisticaModel } from 'src/models/EstadisticaModel';
import { JugadorModel } from 'src/models/JugadorModel';
import { AlertaService } from 'src/services/alerta-service/alerta.service';
import { GenericService } from 'src/services/generic-service/generic-service.service';
import { MessageService } from 'src/services/suscribe-service/message-service.service';

@Component({
  selector: 'app-jugador-estadisticas',
  templateUrl: './jugador-estadisticas.page.html',
  styleUrls: ['./jugador-estadisticas.page.scss'],
})
export class JugadorEstadisticasPage implements OnInit {

  public jugador: JugadorModel;
  public equipos: EquipoModel[] = [];
  public b: boolean = false;
  public estadisticaGral: EstadisticaModel;

  public deleteEquipo: EquipoModel;

  constructor(
    private route: ActivatedRoute,
    private spinnerDialog: SpinnerDialog,
    private genericService: GenericService,
    private alertaService: AlertaService,
    private messageService: MessageService,
    public alertCtrl: AlertController,
    private router: Router,
    private location: Location
  ) {
    this.route.params.subscribe((params: any) => {
      this.jugador = JSON.parse(route.snapshot.params["jugador"]);
      this.equipos = JSON.parse(route.snapshot.params["equipos"]);
    });
  }

  ngOnInit() {
  }

  editEstadisticasByEquipo(equipo: EquipoModel) {
    this.spinnerDialog.show();
    console.log(equipo);
    let params = {
      "touch_pass": equipo.touch_pass,
      "annotation_by_race": equipo.annotation_by_race,
      "annotation_by_pass": equipo.annotation_by_pass,
      "interceptions": equipo.interceptions,
      "sachs": equipo.sachs,
      "conversions": equipo.conversions,
      "id": equipo.id_estadistica
    };
    console.log(params);
    this.genericService.post("estadisticas/updateTeamStatisticsFromPlayer", JSON.stringify(params)).subscribe((res: any) => {
      console.log(res);
      let parametros = res;
      if (parametros.status === "A") {
        this.estadisticaGral = new EstadisticaModel();
        this.equipos.forEach(e => {
          this.estadisticaGral.touch_pass += parseInt(e.touch_pass.toString());
          this.estadisticaGral.annotation_by_race += parseInt(e.annotation_by_race.toString());
          this.estadisticaGral.annotation_by_pass += parseInt(e.annotation_by_pass.toString());
          this.estadisticaGral.interceptions += parseInt(e.interceptions.toString());
          this.estadisticaGral.sachs += parseInt(e.sachs.toString());
          this.estadisticaGral.conversions += parseInt(e.conversions.toString());
        });
        console.log(this.estadisticaGral);
        this.messageService.sendMessage(this.estadisticaGral);
        this.alertaService.alertaBasica(this.genericService.headerExito, "Los valores estadísticos del equipo se han modificado correctamente", null);
      } else {
        this.alertaService.warnAlert(this.genericService.headerValidacion, res.description, null);
      }
      this.spinnerDialog.hide();
    }, (err: HttpErrorResponse) => {
      console.log(err);
      console.log(err.error.description);
      this.spinnerDialog.hide();
      this.alertaService.errorAlert(this.genericService.headerError, err.error.description, null);
    });
  }

  decrementTouch(equipo: EquipoModel, type: number) {
    switch (type) {
      case 1:
        if (equipo.touch_pass > 0) {
          equipo.touch_pass--;
        }
        break;
      case 2:
        if (equipo.annotation_by_pass > 0) {
          equipo.annotation_by_pass--;
          break;
        }
      case 3:
        if (equipo.annotation_by_race > 0) {
          equipo.annotation_by_race--;
        }
        break;
      case 4:
        if (equipo.interceptions > 0) {
          equipo.interceptions--;
        }
        break;
      case 5:
        if (equipo.sachs > 0) {
          equipo.sachs--;
        }
        break;
      case 6:
        if (equipo.conversions > 0) {
          equipo.conversions--;
        }
        break;
    }
  }

  incrementTouch(equipo: EquipoModel, type: number) {
    switch (type) {
      case 1:
        equipo.touch_pass++;
        break;
      case 2:
        equipo.annotation_by_pass++;
        break;
      case 3:
        equipo.annotation_by_race++;
        break;
      case 4:
        equipo.interceptions++;
        break;
      case 5:
        equipo.sachs++;
        break;
      case 6:
        equipo.conversions++;
        break;
    }
  }

  async deleteEstadisticasByEquipo(equipo: EquipoModel) {
    const confirm = await this.alertCtrl.create({
      header: "Confirmación",
      message: "¿Estás seguro de eliminar la estadística de equipo?, recuerda que se perderá toda la información relacionada a ella",
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.eliminar(equipo);
          }
        }
      ]
    });
    return await confirm.present();
  }

  eliminar(equipo: EquipoModel) {
    this.spinnerDialog.show();
    let params = {
      "idEquipo": equipo.id,
      "idJugador": this.jugador.id,
    };
    console.log(params);

    this.genericService.post("equipos/removeTeamFromPlayer", JSON.stringify(params)).subscribe((res: any) => {
      console.log(res);
      let parametros = res;
      if (parametros.status === "A") {
        this.removeitem(equipo);
        if (this.equipos.length == 0) {
          this.location.back();
        } else {
          this.estadisticaGral = new EstadisticaModel();
          this.equipos.forEach(e => {
            this.estadisticaGral.touch_pass += parseInt(e.touch_pass.toString());
            this.estadisticaGral.annotation_by_race += parseInt(e.annotation_by_race.toString());
            this.estadisticaGral.annotation_by_pass += parseInt(e.annotation_by_pass.toString());
            this.estadisticaGral.interceptions += parseInt(e.interceptions.toString());
            this.estadisticaGral.sachs += parseInt(e.sachs.toString());
            this.estadisticaGral.conversions += parseInt(e.conversions.toString());
          });
          console.log(this.estadisticaGral);
          this.messageService.sendMessage(this.estadisticaGral);
        }
      } else {
        this.alertaService.warnAlert(this.genericService.headerValidacion, res.description, null);
      }
      this.spinnerDialog.hide();
    }, (err: HttpErrorResponse) => {
      this.spinnerDialog.hide();
      this.alertaService.errorAlert(this.genericService.headerError, err.error.description, null);
    });
  }

  removeitem(e: EquipoModel) {
    const index = this.equipos.findIndex(equipo => equipo.id == e.id);
    this.equipos.splice(index, 1);
  }
}   
