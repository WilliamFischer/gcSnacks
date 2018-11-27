import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';

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
  orders: any;
  orderValues: any;
  loader: boolean = true;
  noOrders: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fireStore: AngularFirestore,private alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');

    this.checkOrders();
  }

  deleteOrder(order){
    var orderSource = this.fireStore.doc<any>('deliveries/' + order.time);
    orderSource.update({alive:false});

    this.checkOrders();
  }

  approveOrder(order){
    var orderSource = this.fireStore.doc<any>('deliveries/' + order.time);
    orderSource.update({approved:true});

    this.checkOrders();
  }

  cancelOrder(order){
    var orderSource = this.fireStore.doc<any>('deliveries/' + order.time);
    orderSource.update({approved:false});

    console.log('Order Cancelled')

    this.checkOrders();
  }

  goHome(){
    this.navCtrl.push(HomePage);
  }

  completeOrder(order){
    var orderSource = this.fireStore.doc<any>('deliveries/' + order.time);
    orderSource.update({alive:false});

    console.log('Order Completed')

    this.checkOrders();
  }

  snackAdd(){
    this.addSnack = true;
  }

  noSnackAdd(){
    this.addSnack = false;
  }

  checkOrders(){
    var delArray = [];
    var delArray2 = [];
    var deadCount = 0;
    this.loader = true;
    this.noOrders = false;

    this.fireStore.collection('deliveries').valueChanges().subscribe(values =>{
      this.orderValues = values;

      values.forEach(eachObj => {
        console.log(eachObj);

        if(eachObj['alive'] == false){
          deadCount++
        }

        this.fireStore.collection<any>('deliveries/' + eachObj['time'] + '/cart').valueChanges().subscribe(values =>{
          delArray.push(values)
        });
      });

      if(this.orderValues.length != 0){
        var orderInterval = setInterval(() => {
          if(delArray.length != 0){
            delArray.forEach(delivery => {
                delivery.forEach(delivery2 => {
                  if(delivery2.cart){
                    delArray2.push(delivery2.cart)
                  }
                })
            });
            clearInterval(orderInterval);
          }
        }, 1000);
      }else{
        console.log('ORDER ARRAY EMPTY')

        console.log('No New Orders')
        this.loader = false;
        this.noOrders = true;
      }

    });

    var deliveryInterval = setInterval(() => {
      if(delArray2.length != 0){
        console.log(deadCount + " DEADCOUNT VS FINALARRAY " + delArray.length);

        if(deadCount == delArray.length){
          console.log('No New Orders')
          this.loader = false;
          this.noOrders = true;
        }else{
          this.loader = false;
          this.deliveries = delArray2;

          this.orders = this.orderValues;

          console.log('Orders Discovered: ')
          console.log(this.orders);
        }

        clearInterval(deliveryInterval);

      }
    }, 1000);
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

}
