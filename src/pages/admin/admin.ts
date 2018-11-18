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
  };
  addSnack: boolean;
  deliveries: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fireStore: AngularFirestore) {


    var delArray = [];

    this.fireStore.collection('deliveries').valueChanges().subscribe(values =>{

      values.forEach(eachObj => {
        var deliveriesSource = this.fireStore.collection<any>('deliveries/' + eachObj.time + '/cart').valueChanges().subscribe(
        values =>{
          delArray.push(values)
        });
      });

      this.deliveries = delArray;
      console.log(this.deliveries)
    });
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

    alert('item added')
  }

  goHome(){
    this.navCtrl.push(HomePage);
  }

  snackAdd(){
    this.addSnack = true;
  }
  noSnackAdd(){
    this.addSnack = false;
  }
}
