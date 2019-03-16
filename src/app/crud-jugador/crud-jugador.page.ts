import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, Platform } from '@ionic/angular';
import { ViewController } from '@ionic/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ValidationServiceService } from 'src/services/validation-service/validation-service.service';
import { AlertaService } from 'src/services/alerta-service/alerta.service';
import { GenericService } from 'src/services/generic-service/generic-service.service';
import { LevelModel } from 'src/models/LevelModel';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { EquipoModel } from 'src/models/EquipoModel';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet/ngx';
import { JugadorModel } from 'src/models/JugadorModel';

@Component({
  selector: 'app-crud-jugador',
  templateUrl: './crud-jugador.page.html',
  styleUrls: ['./crud-jugador.page.scss'],
})
export class CrudJugadorPage implements OnInit {

  public operation: string = "";
  public plataforma: boolean;
  public formGroup: FormGroup;

  public niveles: LevelModel[] = [];
  public equipos: EquipoModel[] = [];

  public fotografia: string = null;

  public jugador: any;

  public render: boolean = false;
  public renderTeams: boolean = true;

  constructor(
    private navParms: NavParams,
    private modalCtrl: ModalController,
    private platform: Platform,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private genericService: GenericService,
    private spinnerDialog: SpinnerDialog,
    private camera: Camera,
    private actionSheet: ActionSheet
  ) {
    this.plataforma = platform.is("android");
    this.operation = navParms.get("type");
    if (this.operation != "Crear") {
      this.render = true;
    }
    this.formGroup = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: [''],
      userName: ['', !this.render ? Validators.required : ""],
      password: ['', !this.render ? Validators.compose([Validators.required, ValidationServiceService.passwordValidator]) : ""],
      confirmPassword: [''],
      rama: ['', Validators.required],
      nivel: ['', Validators.required],
      saldo: ['', Validators.compose([Validators.required])],
      equipos: ['']
    });

    if (this.operation != "Crear") {
      this.jugador = navParms.get("jugador");

      this.formGroup.patchValue({
        apellidoPaterno: this.jugador.apellido_paterno,
        apellidoMaterno: this.jugador.apellido_materno,
        nombre: this.jugador.nombre,
        rama: this.jugador.rama,
        nivel: this.jugador.idLevel,
        saldo: this.jugador.sale
      });
      this.fotografia = this.jugador.fotografia;
    }
    this.getLevels();
    this.getTeams();
  }

  ngOnInit() {
  }

  clearData() {
    this.getLevels();
    this.getTeams();
    this.formGroup.reset();
    if (this.render) {
      this.formGroup.patchValue({
        apellidoPaterno: this.jugador.apellido_paterno,
        apellidoMaterno: this.jugador.apellido_materno,
        nombre: this.jugador.nombre,
        rama: this.jugador.rama,
        nivel: this.jugador.idLevel,
        saldo: this.jugador.sale
      });
      this.fotografia = this.jugador.fotografia;
    }
  }

  cancelar(data: any = null) {
    console.log(data);
    this.modalCtrl.dismiss({ data });
  }

  validacion() {
    this.spinnerDialog.show();
    if (this.formGroup.dirty && this.formGroup.valid) {
      if (!this.render) {
        if (this.formGroup.value.password == this.formGroup.value.confirmPassword) {
          this.crearJugador();
        } else {
          this.spinnerDialog.hide();
          this.alertaService.warnAlert(this.genericService.headerValidacion, "Las contraseñas ingresadas no coinciden", null);
        }
      } else {
        this.editarJugador();
      }
    } else {
      this.spinnerDialog.hide();
      this.alertaService.warnAlert(this.genericService.headerValidacion, "Favor de llenar los campos requeridos", null);
    }
  }
  editarJugador(): any {
    let params = {
      "apellido_paterno": this.formGroup.value.apellidoPaterno,
      "apellido_materno": this.formGroup.value.apellidoMaterno == '' ? null : this.formGroup.value.apellidoMaterno,
      "nombre": this.formGroup.value.nombre,
      "idLevel": this.formGroup.value.nivel,
      "rama": this.formGroup.value.rama,
      "sale": this.formGroup.value.saldo,
      "fotografia": this.fotografia,
      "idJugador": this.jugador.id,
      "equipos": this.formGroup.value.equipos,
    };
    console.log(params);
    this.genericService.post("jugadores/updatePlayer", JSON.stringify(params)).subscribe((res: any) => {
      console.log(res);
      let parametros = res;
      if (parametros.status === "A") {
        this.alertaService.alertaBasica(this.genericService.headerExito, "El jugador se ha actualizado correctamente", null);
        this.cancelar(1);
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

  crearJugador() {
    let params = {
      "username": this.formGroup.value.userName,
      "apellido_paterno": this.formGroup.value.apellidoPaterno,
      "apellido_materno": this.formGroup.value.apellidoMaterno == '' ? null : this.formGroup.value.apellidoMaterno,
      "password": this.formGroup.value.password,
      "nombre": this.formGroup.value.nombre,
      "equipos": this.formGroup.value.equipos,
      "idLevel": this.formGroup.value.nivel,
      "rama": this.formGroup.value.rama,
      "sale": this.formGroup.value.saldo,
      "fotografia": this.fotografia
    };
    console.log(params);
    this.genericService.post("jugadores/createPlayer", JSON.stringify(params)).subscribe((res: any) => {
      console.log(res);
      let parametros = res;
      if (parametros.status === "A") {
        this.alertaService.alertaBasica(this.genericService.headerExito, "El jugador se ha creado correctamente", null);
        this.cancelar(1);
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

  ionRefresh(event) {
    setTimeout(() => {
      //complete()  signify that the refreshing has completed and to close the refresher
      event.target.complete();
      this.clearData();
    }, 3000);
  }

  getLevels() {
    this.niveles = [];
    this.genericService.get("level/getLevels", new HttpParams()).subscribe((res: any) => {
      console.log(res);
      let parametros = res.parameters;
      parametros.forEach(nivel => {
        this.niveles.push(new LevelModel(nivel.id, nivel.level));
      });
      this.spinnerDialog.hide();
    }, (err: HttpErrorResponse) => {
      console.log(err.error.description);
      this.spinnerDialog.hide();
      this.alertaService.errorAlert(this.genericService.headerError, "Verifica tu conexión ya que el campo nivel es requerido, puedes deslizar hacia abajo y actualizar", null);
    });
  }

  getTeams() {
    this.equipos = [];
    if (!this.render) {
      console.log("Equipos todos");
      
      this.genericService.get("equipos/getTeams", new HttpParams()).subscribe((res: any) => {
        console.log(res);
        let parametros = res.parameters;
        parametros.forEach(equipo => {
          this.equipos.push(new EquipoModel(equipo.id, equipo.nombre));
        });
        this.spinnerDialog.hide();
      }, (err: HttpErrorResponse) => {
        console.log(err.error.description);
        this.spinnerDialog.hide();
        this.alertaService.errorAlert(this.genericService.headerError, "Verifica tu conexión ya que el campo equipo es requerido, puedes deslizar hacia abajo y actualizar", null);
      });
    } else {
      console.log("Equipos no seleccionados");
      let params = new HttpParams();
      params = params.append('idJugador', this.jugador.id.toString());
      console.log(this.jugador);
      this.genericService.get("equipos/getTeamsNotAsigned", params).subscribe((res: any) => {
        console.log(res);
        let parametros = res.parameters;
        parametros.forEach(equipo => {
          this.equipos.push(new EquipoModel(equipo.id, equipo.nombre));
        });
        if(this.equipos.length==0){
          this.renderTeams = false;
        }
        this.spinnerDialog.hide();
      }, (err: HttpErrorResponse) => {
        console.log(err.error.description);
        this.spinnerDialog.hide();
        this.alertaService.errorAlert(this.genericService.headerError, "Verifica tu conexión ya que el campo equipo es requerido, puedes deslizar hacia abajo y actualizar", null);
      });
    }
  }

  seleccionImagen() {
    let buttonLabels = ['Tomar una fotografía', 'Seleccionar una imagen', 'Eliminar la imagen'];

    const options: ActionSheetOptions = {
      title: 'Que desear realizar?',
      subtitle: 'Selecciona',
      buttonLabels: buttonLabels,
      addCancelButtonWithLabel: 'Cancelar',
      addDestructiveButtonWithLabel: 'Eliminar',
      destructiveButtonLast: true
    }

    this.actionSheet.show(options).then((buttonIndex: number) => {
      console.log('Button pressed: ' + buttonIndex);
    });
  }

  tomarFoto() {

    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100
    }

    this.camera.getPicture(options).then(imageData => {
      //data:image/jpeg;base64,
      this.fotografia = `${imageData}`;
      console.log(this.fotografia);
    }).catch(error => {
      console.error(error);
    });

  }

  seleccionarFoto() {

    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then(imageData => {
      this.fotografia = `${imageData}`;
    }).catch(error => {
      console.error(error);
    });
  }

  borrarImagen() {
    if (this.fotografia == null) {
      this.alertaService.warnAlert(this.genericService.headerValidacion, "No ha capturado o seleccionado una imagen", null);
    } else {
      this.fotografia = null;
      this.alertaService.alertaBasica(this.genericService.headerExito, "Tu imagen ha sido borrada", null);
    }
  }
}
