import { Component } from '@angular/core';
import { NavController,ModalController,PopoverController,AlertController  } from 'ionic-angular';

import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { MorePopoverPage } from '../morePopover';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  showSearch: boolean;
  loading: boolean = false;

  cards: any;
  userSaveLocation: any;
  userCart: any;
  itemShowing: boolean = false;
  cardName: string;
  cardImg: string;
  cardPrice: number;
  cardDesc: string;
  cardWeight: number;
  cardAmount: number;
  itemQuantity: number = 1;
  adjustedPrice: any;
  selectedCat: string;

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
    if(!this.afAuth.auth.currentUser){
      this.afAuth.auth.signOut().then(() => {
         this.navCtrl.push(LoginPage)
      });
    }else{
      console.log("User Access Details:")
      console.log(this.afAuth.auth.currentUser)
    }

    this.selectedCat = 'chocolate';

    this.fireStore.doc('users/' + this.afAuth.auth.currentUser.uid).valueChanges().subscribe(
      values =>{
        if(values){
          var userName = this.afAuth.auth.currentUser.displayName;
          console.log("Welcome back " + userName)
        }else{
          this.createUserDB();
        }
      });
  }

  showItemDetails(card){
    this.itemShowing = true;

    this.cardName = card.name;
    this.cardPrice = card.price;
    this.adjustedPrice = card.price;
    this.cardImg = card.imgurl;
    this.cardDesc = card.desc;
    this.cardWeight = card.weight;
    this.cardAmount = null;


    this.showSearch = false;
  }

  goToHomeMenu(){
    this.itemShowing = null;

    this.cardName = null;
    this.cardPrice = null;
    this.adjustedPrice = null;
    this.cardDesc = null;
    this.cardWeight = null;
    this.cardAmount = null;

    this.itemQuantity = 1;
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
    var userUID = this.afAuth.auth.currentUser.uid;

    this.userCart = this.fireStore.doc<any>('users/' + userUID + '/cart/' + this.cardName);
    this.userCart.set({
      item: this.cardName,
      price: this.cardPrice,
      img: this.cardImg,
      quanitity: this.itemQuantity,
      amount: this.adjustedPrice
    })

    console.log(this.cardName + ' added to cart')

    this.itemShowing = null;
    this.cardName = null;
    this.cardPrice = null;
    this.adjustedPrice = null;
    this.cardDesc = null;
    this.cardWeight = null;
    this.cardAmount = null;

    this.itemQuantity = 1
  }

  viewCart(){
    console.log("Open cart model")
    var modalPage = this.modalCtrl.create('CartPage');
    modalPage.present();
  }

  itemCountUp(){
    this.itemQuantity++
    var newPrice = +this.adjustedPrice + +this.cardPrice;
    this.adjustedPrice = newPrice + '.00';
  }

  itemCountDown(){
    if(this.itemQuantity == 1){}else{
      this.itemQuantity--;
      var newPrice = this.adjustedPrice - this.cardPrice;
      this.adjustedPrice = newPrice + '.00';
    }
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

            console.log("User Successfully added");
            window.location.reload();
          }
        }
      ]
    });
    alert.present();


  }

  selectCat(cat){
    this.selectedCat = cat;

    this.itemShowing = null;
    this.itemQuantity = 1;
  }
}
