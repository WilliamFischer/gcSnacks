import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Providers
import { AuthProvider } from '../../providers/auth/auth'
import { HomePage } from '../home/home'


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  facebookLogin(){
    this.authService.loginWithFacebook().then(res=>{
      console.log("SUCCESS");
      this.navCtrl.setRoot(HomePage);
    }).catch(err=>{
      console.log(err)
    })
  }

  googleLogin(){
    this.authService.loginWithGoogle().then(res=>{
      console.log("SUCCESS");
      this.navCtrl.setRoot(HomePage);
    }).catch(err=>{
      console.log(err)
    })
  }

}
