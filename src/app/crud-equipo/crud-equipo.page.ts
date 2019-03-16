import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavParams, ModalController, Platform } from '@ionic/angular';
import { AlertaService } from 'src/services/alerta-service/alerta.service';
import { GenericService } from 'src/services/generic-service/generic-service.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ValidationServiceService } from 'src/services/validation-service/validation-service.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-crud-equipo',
  templateUrl: './crud-equipo.page.html',
  styleUrls: ['./crud-equipo.page.scss'],
})
export class CrudEquipoPage implements OnInit {

  public operation: string = "";
  public plataforma: boolean;
  public formGroup: FormGroup;

  public fotografia: string = null;

  public equipo: any;

  public render: boolean = false;

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
      nombre: ['', Validators.required]
    });

    if (this.operation != "Crear") {
      this.equipo = navParms.get("equipo");
      this.fotografia = this.equipo.fotografia;
      this.formGroup.patchValue({
        nombre: this.equipo.nombre
      });
    }
  }

  ngOnInit() {
  }

  cancelar(data: any = null) {
    console.log(data);
    this.modalCtrl.dismiss({ data });
  }

  validacion() {
    this.spinnerDialog.show();
    if (this.formGroup.dirty && this.formGroup.valid) {
      if (this.render) {
        this.editarEquipo();
      } else {
        this.crearEquipo();
      }
    } else {
      this.spinnerDialog.hide();
      this.alertaService.warnAlert(this.genericService.headerValidacion, "Favor de llenar los campos requeridos", null);
    }
  }

  editarEquipo(): any {
    let params = {
      "nombre": this.formGroup.value.nombre,
      "idEquipo": this.equipo.id,
      "idEstatus": "1",
      "fotografia": this.fotografia
    };
    console.log(params);
    this.genericService.post("equipos/updateTeam", JSON.stringify(params)).subscribe((res: any) => {
      console.log(res);
      let parametros = res;
      if (parametros.status === "A") {
        this.alertaService.alertaBasica(this.genericService.headerExito, "El equipo se ha actualizado correctamente", null);
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

  crearEquipo() {
    let params = {
      "nombre": this.formGroup.value.nombre,
      "fotografia": this.fotografia
    };
    console.log(params);
    this.genericService.post("equipos/createTeam", JSON.stringify(params)).subscribe((res: any) => {
      console.log(res);
      let parametros = res;
      if (parametros.status === "A") {
        this.alertaService.alertaBasica(this.genericService.headerExito, "El equipo se ha creado correctamente", null);
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
