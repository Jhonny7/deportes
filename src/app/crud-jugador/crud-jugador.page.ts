import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, Platform } from '@ionic/angular';
import { ViewController } from '@ionic/core';

@Component({
  selector: 'app-crud-jugador',
  templateUrl: './crud-jugador.page.html',
  styleUrls: ['./crud-jugador.page.scss'],
})
export class CrudJugadorPage implements OnInit {

  public operation: string = "";
  public plataforma: boolean;

  constructor(
    private navParms: NavParams,
    private modalCtrl: ModalController,
    private platform: Platform
  ) { 
    this.operation = navParms.get("type");
    this.plataforma = platform.is("android"); 
  }

  ngOnInit() {
  }

  cancelar() {
    this.modalCtrl.dismiss();
  }
}
