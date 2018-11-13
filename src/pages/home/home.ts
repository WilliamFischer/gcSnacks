import { Component } from '@angular/core';
import { NavController,ModalController,PopoverController  } from 'ionic-angular';

import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';

import { MorePopoverPage } from '../morePopover';

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

  constructor(public navCtrl: NavController,public modalCtrl: ModalController,public popoverCtrl: PopoverController,private fireStore: AngularFirestore) {
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

  searchToggle(){
    if(this.showSearch){
      this.showSearch = false;
    }else{
      this.showSearch = true;
    }
  }

  morePopover(myEvent) {
    let popover = this.popoverCtrl.create(MorePopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  addItemtoCart() {
  
  }

  viewCart(){
    console.log("Open cart model")
    var modalPage = this.modalCtrl.create('CartPage');
    modalPage.present();
  }
}
