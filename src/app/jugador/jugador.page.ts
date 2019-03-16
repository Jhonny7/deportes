import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadisticaModel } from 'src/models/EstadisticaModel';
import { JugadorModel } from 'src/models/JugadorModel';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { UtilService } from 'src/services/util-service/util.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { GenericService } from 'src/services/generic-service/generic-service.service';
import { AlertaService } from 'src/services/alerta-service/alerta.service';
import { EquipoModel } from 'src/models/EquipoModel';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/services/suscribe-service/message-service.service';

@Component({
  selector: 'app-jugador',
  templateUrl: './jugador.page.html',
  styleUrls: ['./jugador.page.scss'],
})
export class JugadorPage implements OnInit, OnDestroy {

  public estadisticaGral: EstadisticaModel;
  public jugador: JugadorModel;
  public equipos: EquipoModel[] = [];

  public subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private spinnerDialog: SpinnerDialog,
    private genericService: GenericService,
    private alertaService: AlertaService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.route.params.subscribe((params: any) => {
      this.jugador = JSON.parse(route.snapshot.params["jugador"]);
      console.log(this.jugador);
      this.estadisticaGral = JSON.parse(route.snapshot.params["estadisticas"]);
    });
    this.subscription = this.messageService.getMessage().subscribe(obj => {
      this.estadisticaGral = obj.obj;
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  ngOnInit() {
  }

  verEstadisticas() {
    console.log("estadísticas por equipo");
    this.spinnerDialog.show(UtilService.mensajeCarga);
    let paramsE = new HttpParams();
    paramsE = paramsE.append('idJugador', this.jugador.id.toString());
    this.equipos = [];
    this.genericService.get("equipos/getTeamsByPlayer", paramsE).subscribe((data: any) => {
      if (data.status == "A") {
        let datosE = data.parameters;
        if (datosE.length > 0) {
          datosE.forEach(equipo => {
            this.equipos.push(new EquipoModel(
              equipo.id_equipo,
              equipo.nombre_equipo,
              equipo.id_jugador,
              equipo.id_usuario,
              equipo.id_estadistica,
              equipo.touch_pass,
              equipo.annotation_by_pass,
              equipo.annotation_by_race,
              equipo.interceptions,
              equipo.sachs,
              equipo.conversions
            ));
          });
          this.router.navigate(["/jugador-estadisticas", { jugador: JSON.stringify(this.jugador), equipos: JSON.stringify(this.equipos) }]);
        } else {
          this.alertaService.warnAlert(this.genericService.headerValidacion, `El jugador ${this.jugador.nombre} ${this.jugador.apellidoPaterno} no esta asignado a un equipo`, null);
        }
      } else {
        this.alertaService.warnAlert(this.genericService.headerValidacion, data.description, null);
      }
      this.spinnerDialog.hide();
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.spinnerDialog.hide();
      this.alertaService.errorAlert(this.genericService.headerError, err.error.description + " ,puedes deslizar hacia abajo y actualizar", null);
    });
  }
}
