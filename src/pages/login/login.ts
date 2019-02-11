import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

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
  emailMode: boolean;

  email: string;
  password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthProvider,public loadingCtrl: LoadingController, private iab: InAppBrowser) {
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

  openTAC(){
    this.iab.create('https://munchapp.com.au/tou.html');
  }

  openPP(){
    this.iab.create('https://munchapp.com.au/pp.html');
  }

  emailTrigger(){
    if(this.emailMode){
      this.emailMode = false;
    }else{
      this.emailMode = true;
    }

  }

  submitEmail(){
    let loading = this.loadingCtrl.create({
      content: 'Logging you in..'
    });
    loading.present();

    this.authService.loginWithEmail(this.email, this.password).then(res=>{
      console.log("Logging user in...");
      loading.dismiss();
      this.navCtrl.setRoot(HomePage);
    }).catch(err=>{
      loading.dismiss();
      console.log(err)

      if(err.code == 'auth/wrong-password' || err.code == 'auth/user-not-found'){
        console.log("SIGNING USER UP");

        this.authService.signupWithEmail(this.email, this.password).then(res=>{
          console.log("User Signed Up");
          loading.dismiss();
          this.navCtrl.setRoot(HomePage);
        }).catch(err=>{
          loading.dismiss();
          alert(err)
        })
      }

    })
  }

}
