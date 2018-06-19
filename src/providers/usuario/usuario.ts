import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Subscription} from 'rxjs/Subscription';

@Injectable()
export class UsuarioProvider {

  username:string;
  usuario:any = {};

  private doc:Subscription;

  constructor(private afDB: AngularFirestore,
              private platform: Platform,
              private storage: Storage) {}

  verificarUsuario(username:string){
    username = username.toLowerCase();
    return new Promise((resolve, reject) => {
      this.doc = this.afDB.doc(`/usuarios/${username}`)
               .valueChanges().subscribe(data => {
                 if(data){
                   this.username = username;
                   this.usuario = data;
                   this.guardarStorage();
                   resolve(true);
                 }else{
                   //incorrecto
                   resolve(false);
                 }
               });
    });
  }

  guardarStorage(){
    if(this.platform.is("cordova")){
      this.storage.set("username", this.username);
    }else{
      localStorage.setItem("username", this.username);
    }
  }

  obtenerStorage(){
    return new Promise((resolve, reject) => {
      if(this.platform.is("cordova")){
        this.storage.get("username").then((val) => {
          if(val){
            this.username = val;
            resolve(true);
          }else{
            resolve(false);
          }
        });
      }else{
        if(localStorage.getItem("username")){
          this.username = localStorage.getItem("username");
          resolve(true);
        }else{
          resolve(false);
        }
      }
    });
  }

  logout(){
    this.username = null;
    if(this.platform.is("cordova")){
      this.storage.remove("username");
    }else{
      localStorage.removeItem("username");
    }

    this.doc.unsubscribe();
  }

}
