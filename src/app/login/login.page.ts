import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AlertaService } from 'src/services/alerta-service/alerta.service';
import { GenericService } from 'src/services/generic-service/generic-service.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { UtilService } from 'src/services/util-service/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public user: string = null;
  public password: string = null;

  public formGroup: FormGroup;
  public verPassword: string = "password";

  constructor(
    private menuCtrl: MenuController,
    private genericService: GenericService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder,
    private router: Router,
    private spinnerDialog: SpinnerDialog) {
    this.formGroup = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
      sesionActiva: [false]
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {

  }

  verifyShields() {
    if (this.formGroup.dirty && this.formGroup.valid) {
      this.ingresar();
    } else {
      this.alertaService.warnAlert(this.genericService.headerValidacion, "Favor de llenar los campos requeridos", null);
    }
  }

  ingresar() {
    let params = new HttpParams();
    params = params.append('user', this.formGroup.value.user);
    params = params.append('password', this.formGroup.value.password);
    this.spinnerDialog.show(UtilService.mensajeCarga);
    this.genericService.get("login/getAuthenticate", params).subscribe((res: any) => {
      console.log(res);
      let parametros = res.parameters;
      this.alertaService.alertaBasica("Bienvenid@", parametros.nombre, null);
      console.log(parametros);
      //this.router.navigate(['/home',parametros]);
      console.log(this.formGroup.value.sesionActiva);
      if(this.formGroup.value.sesionActiva){
        localStorage.setItem("user",JSON.stringify(parametros));
      }
      this.router.navigate(['/home', parametros]);
      this.spinnerDialog.hide();
    }, (err: HttpErrorResponse) => {
      console.log(err.error.description);
      this.spinnerDialog.hide();
      this.alertaService.errorAlert(this.genericService.headerError, err.error.description, null);
    });
  }

  verPasswordMethod(event) {
    if (this.verPassword == "password") {
      this.verPassword = "text";
    } else {
      this.verPassword = "password";
    }
  }
}
