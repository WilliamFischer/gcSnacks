import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFirestore } from 'angularfire2/firestore';

import { HomePage } from '../home/home'
/**
 * Generated class for the AdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  specificSnack: any;
  allItems: any;
  item = {
    name: '',
    category: '',
    price: '',
    weight: '',
    desc: '',
    imgurl: ''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public fireStore: AngularFirestore) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }


  addItem(){
    this.specificSnack = this.fireStore.doc<any>('snacks/' + this.item.name);
    this.specificSnack.set({
      name: this.item.name,
      category: this.item.category,
      price: this.item.price,
      weight: this.item.weight,
      desc: this.item.desc,
      imgurl: this.item.imgurl,
    })

  }

  goHome(){
    this.navCtrl.push(HomePage);
  }
}
