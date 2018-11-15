import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';

// Providers
import { AuthProvider } from '../../providers/auth/auth'
import { HomePage } from '../home/home'


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loadingLogin: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthProvider,public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');


  }

  facebookLogin(){
    let loading = this.loadingCtrl.create({
      content: 'Logging you in..'
    });
    loading.present();

    this.authService.loginWithFacebook().then(res=>{
      console.log("SUCCESS");
      loading.dismiss();
      this.navCtrl.setRoot(HomePage);
    }).catch(err=>{
      loading.dismiss();
      alert(err)
    })
  }

  googleLogin(){
    let loading = this.loadingCtrl.create({
      content: 'Logging you in..'
    });
    loading.present();

    this.authService.loginWithGoogle().then(res=>{
      console.log("SUCCESS");
      loading.dismiss();
      this.navCtrl.setRoot(HomePage);
    }).catch(err=>{
      loading.dismiss();
      alert(err)
    })
  }

}
