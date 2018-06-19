import { Component,
         ViewChild } from '@angular/core';

import { IonicPage,
         NavController,
         NavParams,
         Slides,
         AlertController,
         LoadingController } from 'ionic-angular';

import { UsuarioProvider } from '../../providers/usuario/usuario';

import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingController: LoadingController,
              public _usuarioProvider: UsuarioProvider) {
  }

  ionViewDidLoad() {
    this.slides.paginationType = "progress";
    this.slides.lockSwipes(true);
    this.slides.freeMode = false;
  }

  mostrarInput(){
    const prompt = this.alertCtrl.create({
      title: 'Ingresar',
      //message: "Introduza el usuario",
      inputs: [
        {
          name: 'username',
          placeholder: 'Introduza el nombre de usuario'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: data => {
            this.verificarUsuario(data.username);
          }
        }
      ]
    });
    prompt.present();
  }

  verificarUsuario(username:string){
    if(username.length <= 0){
      this.alertCtrl.create({
        title:'El nombre de usuario es obligatorio',
        buttons:[{
          text:'Aceptar',
          handler: data => {
            this.mostrarInput();
          }
        }]
      }).present();
      return false;
    }

    let loading = this.loadingController.create({
      content: "Verificando"
    });

    loading.present();

    this._usuarioProvider.verificarUsuario(username)
                         .then(existe => {

                           loading.dismiss();

                           if(existe){
                             this.slides.lockSwipes(false);
                             this.slides.freeMode = true
                             this.slides.slideNext();
                             this.slides.lockSwipes(true);
                             this.slides.freeMode = false;
                           }else{
                             this.alertCtrl.create({
                               title:'Usuario invalido',
                               subTitle:'Contacte con el Administrador o pruebe de nuevo',
                               buttons:['Aceptar']
                             }).present();
                           }
                         });
  }

  ingresar(){
    this.navCtrl.setRoot(HomePage);
  }

}
