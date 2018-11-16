import { Component } from '@angular/core';
import { ViewController, NavController,AlertController  } from 'ionic-angular';

import { AngularFireAuth } from '@angular/fire/auth';
import { LoginPage } from './login/login';
import { AdminPage } from './admin/admin';


@Component({
  template: `
    <ion-list class="popoverList">
      <ion-list-header class="popoverTitle">Munch</ion-list-header>
      <button ion-item (click)="close()" class="popoverItem topPopoverItem">Settings</button>
      <button ion-item (click)="logOut()" class="popoverItem">Log Out</button>
      <button ion-item (click)="close()" class="popoverItem">Legal</button>
      <button ion-item (click)="triggerAdmin()" class="popoverItem">Admin</button>
    </ion-list>
  `
})
export class MorePopoverPage {
  constructor(public navCtrl: NavController, public viewCtrl: ViewController,public afAuth: AngularFireAuth,private alertCtrl: AlertController) {}

  close() {
    this.viewCtrl.dismiss();
  }

  logOut(){
    this.afAuth.auth.signOut().then(() => {
       this.navCtrl.push(LoginPage)
    });
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
