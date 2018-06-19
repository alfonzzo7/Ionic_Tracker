import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { UbicacionProvider } from '../../providers/ubicacion/ubicacion';
import { UsuarioProvider } from '../../providers/usuario/usuario';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user:any = {}

  constructor(public navCtrl: NavController,
              private _ubicacionProvider: UbicacionProvider,
              private _usuarioProvider: UsuarioProvider) {

                this._ubicacionProvider.iniciarGeoLocalizacion();
                this._ubicacionProvider.inicializarTaxista();

                this._ubicacionProvider.taxista.valueChanges()
                          .subscribe((data) => {
                            this.user = data;
                          });
  }

  salir(){
    this._ubicacionProvider.detenerUbicacion();
    this._usuarioProvider.logout();
    this.navCtrl.setRoot(LoginPage);
  }

}
