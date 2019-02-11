import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams,ModalController,AlertController,LoadingController } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';

import { AngularFireAuth } from '@angular/fire/auth';

import { OrderPage } from '../order/order';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  cartItems: any;
  adjustedPrice: any;
  emptyCart: boolean = false;
  totalPrice:any = 0;
  cartCount: number = 0;
  discountAmount: number = 0;
  itemQuantity: any;
  cartLoading:boolean  = true;
  userAddress: string;
  userName: string;
  userUID: string;
  deliverLocation: any;
  addressTriggered: boolean;
  promoBanner: boolean;
  newAddressSelected: any;

  userSettings: any = {
    showSearchButton: false,
    inputPlaceholderText: "Your address...",
    showRecentSearch: false,
    geoCountryRestriction: ['au'],
  }


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl : ViewController,
    private fireStore: AngularFirestore,
    public afAuth: AngularFireAuth,
    private payPal: PayPal,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController ) {
  }

  ionViewDidLoad() {
    if(parseInt(localStorage.getItem('discount')))
    this.discountAmount = parseInt(localStorage.getItem('discount'));

    this.fireStore.collection('users/' + this.afAuth.auth.currentUser.uid + '/cart').valueChanges().subscribe(
    values =>{
      if(values){
        this.totalPrice = 0;

        this.cartItems = values;

        values.forEach(eachObj => {
          if(eachObj['quanitity']){
            this.calculateTotal(eachObj['amount'], eachObj['quanitity']);
          }
        });

        if(this.totalPrice == 0){
          this.cartLoading  = false;
          this.emptyCart = true;
          this.discountAmount = 0;

          localStorage.setItem('discount', '0');
        }else{
          this.cartLoading  = false;

          var discountAmount = localStorage.getItem('discount');

          if(discountAmount){

            var totalPriceClean = this.totalPrice - ((this.totalPrice * parseInt(discountAmount)) / 100);
            var cutPrice = Number(totalPriceClean).toFixed(2);
            this.totalPrice = cutPrice
            console.log("Final discounted price now $" + this.totalPrice);

          }else{
            console.log("Final price now $" + this.totalPrice)
          }
        }


      }
    });


    this.userAddress = localStorage.getItem('address');
    this.userName = localStorage.getItem('userName');
    this.userUID = localStorage.getItem('userID');


    console.log(this.userAddress);

    this.userSettings['inputString'] = this.userAddress;
    this.userSettings = Object.assign({},this.userSettings);
  }

  closeCart(){
    this.viewCtrl.dismiss();
  }

  itemCardDown(cartItem){
    this.totalPrice = 0;
    this.cartCount = 0;

    var newAmount = cartItem.amount - cartItem.price;
    var newQuantity = cartItem.quanitity - 1;
    var cartSource = this.fireStore.doc<any>('users/' + this.afAuth.auth.currentUser.uid + '/cart/' + cartItem.item);

    cartSource.update({amount:newAmount, quanitity:newQuantity});

    if(newQuantity == 0){
      cartSource.delete();
    }
  }

  itemCardUp(cartItem){
    this.totalPrice = 0;
    this.cartCount = 0;

    var newAmount = +cartItem.amount + +cartItem.price;
    var newQuantity = +cartItem.quanitity + 1;
    var cartSource = this.fireStore.doc<any>('users/' + this.afAuth.auth.currentUser.uid + '/cart/' + cartItem.item);

    cartSource.update({amount:newAmount, quanitity:newQuantity});
  }

  clearCart(){

    let alert = this.alertCtrl.create({
      subTitle: 'Are you sure you would like to clear your cart?',
      buttons: [{
        text: 'Dismiss',
        role: 'cancel',
      },{
        text: 'Clear Cart',
        handler: () => {

          let cartSub = this.fireStore.collection('users/' + this.afAuth.auth.currentUser.uid + '/cart').valueChanges().subscribe(values =>{
            values.forEach(eachObj => {
              var cartSource = this.fireStore.doc<any>('users/' + this.afAuth.auth.currentUser.uid + '/cart/' + eachObj['item']);
              cartSource.delete().then(function() {
                  console.log("Cart Cleared !");

                  cartSub.unsubscribe();
                  // this.totalPrice = 0;
                  // this.cartCount = 0;
              }).catch(function(error) {
                  console.error("Error clearing cart: ", error);
              });
            });

          });

        }
      }]
    });
    alert.present();
  }

  calculateTotal(amount, quanitity){
      if(amount && quanitity){
        this.cartCount = +this.cartCount + +quanitity;

        var totalPriceUnclean =  +this.totalPrice + +amount
        var cutPrice = Number(totalPriceUnclean).toFixed(2);
        this.totalPrice = cutPrice;
      }
  }


  placeOrder(){

    let notAllowedThroughAlert = this.alertCtrl.create({
      message: 'Sorry, it appears your address isn\'t on the Gold Coast, please enter a new address to try again.  <br /><br /> We hope be expanding soon !!',
      buttons: [{
          text: 'Dismiss'
        }]
    });

    let noAddressAlert = this.alertCtrl.create({
      message: 'Please input a delivery address',
      buttons: [{
          text: 'Dismiss'
        }]
    });

    if(!this.newAddressSelected.data){
      noAddressAlert.present();
    }else if(this.newAddressSelected.data.address_components[3].short_name == 'Gold Coast'){
      // var modalPage = this.modalCtrl.create('OrderPage');
      // modalPage.present();

      if(this.totalPrice != 0){
        this.cartLoading  = false;
        this.emptyCart = false;

        this.payPal.init({
          PayPalEnvironmentProduction: 'AR7AHIWIta7z7My5KPOOhkVSFOwVkqdJkrdqoOoTSu68Lvvk2nHn9W9ieE0Odz1jUxrFLF_DccykOGL4',
          PayPalEnvironmentSandbox: 'AQ0uWcu6H4jcvb1MYNt3t3dbhIklQ5luDk_9A3pQtRa6RI1KN7cvkHrT2enUeii2zhjuiO6gV0B46_ad'
          }).then(() => {
          this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
          })).then(() => {

            let paymentAmount = Number(this.totalPrice) + +5;
            let paymentAmountConverted = paymentAmount.toFixed(2).toString();
            console.log('Paying PAYPAL ' + paymentAmountConverted);

            let payment = new PayPalPayment(paymentAmountConverted, 'AUD', 'Munch Order + $5 Delivery Fee', 'sale');
            this.payPal.renderSinglePaymentUI(payment).then(() => {
              alert("Succefully Paid")
              this.viewCtrl.dismiss();


              var today = new Date();
              let hours = today.getHours();
              let minutes = today.getMinutes();
              let seconds = today.getSeconds();
              let milliseconds = today.getMilliseconds();
              var finalTime = hours + ":" + minutes + ":" + seconds + ":" + milliseconds;

              var cutPrice = Number(this.totalPrice).toFixed(2);

              this.deliverLocation = this.fireStore.doc<any>('deliveries/' + finalTime);
              this.deliverLocation.set({
                totalCost: cutPrice,
                approved: false,
                time: finalTime,
                address: this.userAddress,
                username: this.userName,
                uid: this.userUID,
                alive: true
              })

              localStorage.setItem('currentCart', finalTime);

              var cartSource = this.fireStore.collection<any>('users/' + this.afAuth.auth.currentUser.uid + '/cart').valueChanges().subscribe(
              values =>{
                values.forEach(eachObj => {
                  var deliverLocation = this.fireStore.doc<any>('deliveries/' + finalTime + '/cart/' + eachObj.item);
                  deliverLocation.set({
                    cart: {
                      item: eachObj.item,
                      price: eachObj.price,
                      imgurl: eachObj.img,
                      quanitity: eachObj.quanitity,
                      time: finalTime
                    }
                  })

                });
              })

              var modalPage = this.modalCtrl.create('OrderPage');
              modalPage.present();

              //this.navCtrl.push(OrderPage);


            }, (err) => {
              alert("Error " + err)
            });
          }, (err) => {
            alert("Config Error " + err)
          });
          }, (err) => {
            alert("Setup Error " + err)
          });
      }else{
        alert('Your cart is empty')
      }
    }else{
      notAllowedThroughAlert.present();
    }
  }


  changeAddress(){
    this.addressTriggered = true;
  }


  autoCompleteCallback(selectedData:any) {
     console.log(selectedData)
     this.newAddressSelected = selectedData;
  }

  goBackAddress(){
    this.addressTriggered = false;
  }

  confirmAddress(){

    let confirmAddressAlert = this.alertCtrl.create({
      message: 'Your address has been saved',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Dismiss',
          handler: () => {
            console.log('Buy clicked');
                console.log(this.newAddressSelected.data.description);
                this.addressTriggered = false;
          }

        }
      ]
    });

    if(this.newAddressSelected){
      var cartSource = this.fireStore.doc<any>('users/' + this.afAuth.auth.currentUser.uid);
      cartSource.update({address:this.newAddressSelected.data.description});
      this.userAddress = this.newAddressSelected.data.description;

      console.log(this.newAddressSelected.data.description);
      this.addressTriggered = false;
      // confirmAddressAlert.present();
    }else{
      alert('No address inputted')
    }
  }

  enterPromoCode(){

    let loadingPromoCode = this.loadingCtrl.create({
      content: 'Verifying promotional code'
    });

    let promoInvalidAlert = this.alertCtrl.create({
      message: 'Promo invalid',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ]
    });

    let promoAlert = this.alertCtrl.create({
      title: 'Enter your promo code',
      inputs: [
        {
          name: 'code',
          placeholder: 'Promo Code'
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
          text: 'Verify',
          handler: data => {
            var wrongCount = 0;

            if (data.code) {
              loadingPromoCode.present();

              this.fireStore.collection('promoCodes').valueChanges().subscribe(
              values =>{
                values.forEach(eachObj => {
                  //console.log(data.code + " VS " + eachObj['code'])
                  if(data.code != eachObj['code']){
                    wrongCount++
                  }else{
                      loadingPromoCode.dismiss();

                      loadingPromoCode.onDidDismiss(() => {
                        //console.log("User recieves " + eachObj['discountPercent'] +"% discount")
                        this.discountAmount = eachObj['discountPercent'];

                        localStorage.setItem('discount', this.discountAmount.toString());

                        //Save discount info to database
                        // var discountUserSource = this.fireStore.doc<any>('users/' + this.afAuth.auth.currentUser.uid);
                        // discountUserSource.update({discount:this.discountAmount, discountCode: data.code});

                        this.promoBanner = true;

                        //console.log("Taking " + this.discountAmount + "% out of " + this.totalPrice);
                        var totalPriceClean = this.totalPrice - ((this.totalPrice * this.discountAmount) / 100);
                        var cutPrice = Number(totalPriceClean).toFixed(2);
                        this.totalPrice = cutPrice
                        console.log("Final discounted price now $" + this.totalPrice);


                        setTimeout(a=>{
                          this.promoBanner = false;
                        },5000,[]);
                     });
                  }
                });

                if(wrongCount == values.length){
                  loadingPromoCode.dismiss();

                  loadingPromoCode.onDidDismiss(() => {
                    promoInvalidAlert.present();
                 });
                }
              });
            } else {
              alert('No promo code entered!');
            }
          }
        }
      ]
    });

    promoAlert.present();
  }
}
