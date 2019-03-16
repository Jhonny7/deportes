import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
import { AlertaService } from 'src/services/alerta-service/alerta.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private fcm: FCM,
    private alertaService: AlertaService
  ) {
    this.initializeApp();
    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (this.platform.is('ios') || this.platform.is('android')) {
        this.fcm.getToken().then(token => {
          console.log(token);
          this.fcm.onNotification().subscribe(data => {
            if (data.wasTapped) {
              //Notification was received on device tray and tapped by the user.
              console.log(JSON.stringify(data));
            } else {
              //Notification was received in foreground. Maybe the user needs to be notified.
              console.log(JSON.stringify(data));
              this.alertaService.alertaBasica("Hola!, te notificamos que: ", data.body, null);
            }
          });
        });
        
      } else {

      }
      let usuario:any = localStorage.getItem("user");
      if(usuario!=null){
        usuario = JSON.parse(usuario);
        if(usuario.id_rol === 1){
          this.router.navigateByUrl("/level");
        }else{
          this.router.navigateByUrl("/home-jugador");
        }
      }else{
        this.router.navigateByUrl("/login");
      }
    });
  }
}
