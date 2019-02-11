import { Component } from '@angular/core';
import { ViewController, NavController,AlertController,ModalController  } from 'ionic-angular';

import { AngularFireAuth } from '@angular/fire/auth';
import { LoginPage } from './login/login';
import { AdminPage } from './admin/admin';

@Component({
  template: `
    <ion-list class="popoverList">
      <ion-list-header class="popoverTitle">Munch</ion-list-header>
      <button ion-item (click)="pastOrderTrigger()" class="popoverItem">Your Orders</button>
      <button ion-item (click)="contactUs()" class="popoverItem">Contact</button>
      <button ion-item (click)="logOut()" class="popoverItem">Log Out</button>
      <button ion-item (click)="triggerAdmin()" class="popoverItem">Driver Login</button>
    </ion-list>
  `
})
export class MorePopoverPage {
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,) {}

  close() {
    this.viewCtrl.dismiss();
  }

  pastOrderTrigger(){
    console.log("Open cart model")
    var modalPage = this.modalCtrl.create('PastOrdersPage');
    modalPage.present();
  }

  logOut(){
    this.afAuth.auth.signOut().then(() => {
        this.viewCtrl.dismiss();

       this.navCtrl.push(LoginPage)
    });
  }

  contactUs(){
    let alert = this.alertCtrl.create({
      title: 'Contact Munch',
      message: 'Please contact us on <br /><br /><a href="tel:+6142959142">+61 421 959 142</a><br /><br /> or email support at <br /><br /><a href="mailto:support@munchapp.com.au">support@munchapp.com.au</a>',
      enableBackdropDismiss: false,
      buttons: [{
          text: 'Dismiss'
        }]
    });
    alert.present();
  }

  triggerAdmin(){

    let alert = this.alertCtrl.create({
      title: 'Admin Login',
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        },
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Login',
          handler: data => {
            if (data.username == 'admin' && data.password == '123') {
              this.navCtrl.push(AdminPage);
            } else {
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }
}
