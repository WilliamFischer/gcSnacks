import { Component } from '@angular/core';
import { NavController,ModalController,AlertController } from 'ionic-angular';

import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';

import { AdminPage } from '../admin/admin';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  menuValue: number = 0;
  showSearch: boolean;
  loading: boolean = false;

  cards: any;
  itemShowing: boolean = false;
  cardName: string;
  cardImg: string;
  cardPrice: number;
  cardDesc: string;
  cardWeight: number;

  constructor(public navCtrl: NavController,public modalCtrl: ModalController,private alertCtrl: AlertController,private fireStore: AngularFirestore) {
    // this.getSongList()

    this.fireStore.collection('snacks').valueChanges().subscribe(
      values =>{
        this.cards = values
        this.loading = true
        console.log('Database Loaded')
      });
  }


  menuNumber(key){
    this.menuValue = key;
    this.itemShowing = null;
  }

  showItemDetails(card){
    this.itemShowing = true;

    this.cardName = card.name;
    this.cardPrice = card.price;
    this.cardImg = card.imgurl;
    this.cardDesc = card.desc;
    this.cardWeight = card.weight;


    this.showSearch = false;
  }

  goToHomeMenu(){
    this.itemShowing = null;

    this.cardName = null;
    this.cardPrice = null;
    this.cardDesc = null;
    this.cardWeight = null;
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

  searchToggle(){
    if(this.showSearch){
      this.showSearch = false;
    }else{
      this.showSearch = true;
    }
  }

  // getSongList(): AngularFirestoreCollection<Snacks> {
  //   return this.firestore.collection(`songList`);
  // }


  addItemtoCart() {
    let alert = this.alertCtrl.create({
      subTitle: this.cardName + ' added to cart',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  viewCart(){
    console.log("Open cart model")
    var modalPage = this.modalCtrl.create('CartPage');
    modalPage.present();
  }
}
