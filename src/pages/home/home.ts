import { Component } from '@angular/core';
import { NavController,ModalController,PopoverController,AlertController  } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';

import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { MorePopoverPage } from '../morePopover';
import { LoginPage } from '../login/login';

import * as $ from 'jquery';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  today= new Date();
  showSearch: boolean;
  loading: boolean = false;

  cards: any;
  userSaveLocation: any;
  userCart: any;
  itemShowing: boolean = false;
  quantityTrigger: boolean;
  snackTime: boolean;
  cardName: string;
  cardImg: string;
  cardPrice: number;
  cardDesc: string;
  cardWeight: number;
  cardAmount: number;
  cardCat: string;
  itemQuantity: number = 1;
  adjustedPrice: any;
  selectedCat: string;

  constructor(public navCtrl: NavController,public modalCtrl: ModalController,public popoverCtrl: PopoverController,private fireStore: AngularFirestore, public afAuth: AngularFireAuth,private alertCtrl: AlertController,private geolocation: Geolocation,private nativeGeocoder: NativeGeocoder) {

      this.geolocation.getCurrentPosition().then((resp) => {

        let lat = resp.coords.longitude;
        let lng = resp.coords.latitude;
        this.getAddress(lng, lat)

        let date = new Date(this.today);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        if(hours == 23 || hours ==  0 || hours ==  1 || hours ==  2 || hours == 3 ){
          this.snackTime = true;

          setTimeout(a=>{
            this.snackTime = false;
          },15000,[]);

        }else{
          this.snackTime = false;
        }

      }).catch((error) => {
        console.log('Error getting location', error);
      });

    }

  ionViewDidLoad(){

    $('.cardGrid card').css('display', 'none');
    window.addEventListener('scroll', this.scroll, true);

    if(!this.afAuth.auth.currentUser){
      this.afAuth.auth.signOut().then(() => {
         this.navCtrl.push(LoginPage)
      });
    }else{
      console.log("User Access Details:")
      console.log(this.afAuth.auth.currentUser)


      this.fireStore.collection('snacks').valueChanges().subscribe(
        values =>{
          this.cards = values
          this.loading = true
          console.log('Database Loaded')
        });

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
  }

  scroll = (): void => {
    $('.card').addClass('fadeIn');
  };


  getAddress(lng, lat){

    let geoOptions: NativeGeocoderOptions = {
     useLocale: true,
     maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lng, lat, geoOptions)
      .then((result: NativeGeocoderReverseResult[]) => {
        if(result[0].subLocality == 'Gold Coast'){
          console.log("YOUR ON THE GOLD COAST");
          var userAddress = result[0].subThoroughfare + " " + result[0].thoroughfare + ", " + result[0].locality + " (" + result[0].postalCode + ")";
          localStorage.setItem('address', userAddress);
        }else{
          console.log('NOT ON THE COAST')
          let alert = this.alertCtrl.create({
            title: 'Logging off..',
            message: 'Sorry :(, Munch is only available for user\'s on the Gold Coast.,',
            buttons: [{
                text: 'Okay',
                handler: () => {
                  this.afAuth.auth.signOut().then(() => {
                     this.navCtrl.push(LoginPage)
                  });
                }
              }]
          });
          alert.present();
        }
      })
      .catch((error: any) => {
        console.log(error)
        localStorage.setItem('address', '1 Stratie Drive Robina');
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
    this.cardCat = card.category;


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
    this.cardCat = null

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
    this.cardCat = null;

    this.itemQuantity = 1;
    this.quantityTrigger = true;
  }

  viewCart(){
    console.log("Open cart model")
    var modalPage = this.modalCtrl.create('CartPage');
    modalPage.present();
  }

  itemCountUp(){
    this.quantityTrigger = true;

    this.itemQuantity++
    var newPrice = +this.adjustedPrice + +this.cardPrice;
    var cutPrice = Number(newPrice).toFixed(2);
    this.adjustedPrice = cutPrice;
  }

  itemCountDown(){
    this.quantityTrigger = true;

    if(this.itemQuantity == 1){}else{
      this.itemQuantity--;
      var newPrice = this.adjustedPrice - this.cardPrice;
      var cutPrice = Number(newPrice).toFixed(2);
      this.adjustedPrice = cutPrice;
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
