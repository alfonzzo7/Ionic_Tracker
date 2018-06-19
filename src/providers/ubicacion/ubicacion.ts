import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Subscription} from 'rxjs/Subscription';

import { UsuarioProvider } from '../../providers/usuario/usuario';

@Injectable()
export class UbicacionProvider {

  taxista: AngularFirestoreDocument<any>;
  private watch: Subscription;

  constructor(private geolocation: Geolocation,
              private afDB: AngularFirestore,
              private _usuarioProvider: UsuarioProvider) {}

  inicializarTaxista(){
    this.taxista = this.afDB.doc(`/usuarios/${this._usuarioProvider.username}`);
  }

  iniciarGeoLocalizacion(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.taxista.update({
        lat: resp.coords.latitude,
        lng: resp.coords.longitude,
        clave: this._usuarioProvider.username
      });

      this.watch = this.geolocation.watchPosition().subscribe((data) => {
        this.taxista.update({
          lat: data.coords.latitude,
          lng: data.coords.longitude,
          clave: this._usuarioProvider.username
        });
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  detenerUbicacion(){
    try{
      this.watch.unsubscribe();
    }catch(e){
      console.error(JSON.stringify(e));
    }
  }

}
