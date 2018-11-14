import { Component } from '@angular/core';
import { NavController,ModalController,PopoverController,AlertController  } from 'ionic-angular';

import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

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
  userSaveLocation: any;
  itemShowing: boolean = false;
  cardName: string;
  cardImg: string;
  cardPrice: number;
  cardDesc: string;
  cardWeight: number;

  constructor(public navCtrl: NavController,public modalCtrl: ModalController,public popoverCtrl: PopoverController,private fireStore: AngularFirestore, public afAuth: AngularFireAuth,private alertCtrl: AlertController) {
    // this.getSongList()

    this.fireStore.collection('snacks').valueChanges().subscribe(
      values =>{
        this.cards = values
        this.loading = true
        console.log('Database Loaded')
      });
  }

  ionViewDidLoad(){
    console.log("User Access Details:")
    console.log(this.afAuth.auth.currentUser)

    this.fireStore.doc('users/' + this.afAuth.auth.currentUser.uid).valueChanges().subscribe(
      values =>{
        if(!values.phone){
          this.createUserDB();
        }else{
          var userName = this.afAuth.auth.currentUser.displayName;
          console.log("Welcome back " + userName)
        }
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

  createUserDB(){

    console.log("User not in database... adding user")
    var userUID = this.afAuth.auth.currentUser.uid;

    let alert = this.alertCtrl.create({
      title: 'Welcome!',
      subTitle: 'To continue please enter your phone number',
      inputs: [
        {
          name: 'number',
          placeholder: 'number',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Confirm',
          handler: data => {
            this.userSaveLocation = this.fireStore.doc<any>('users/' + userUID);
            this.userSaveLocation.set({
              uid: userUID,
              name: this.afAuth.auth.currentUser.displayName,
              phone: data.number,
              email: this.afAuth.auth.currentUser.email
            })

            console.log("User Successfully added")
          }
        }
      ]
    });
    alert.present();


  }
}
