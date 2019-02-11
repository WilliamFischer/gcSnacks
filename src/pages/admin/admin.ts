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
  timeLeft: number = 180;
  timerTime: string = '00:03:00';
  addSnack: boolean;
  deliveries: any;
  orders: any;
  orderValues: any;
  loader: boolean = true;
  noOrders: boolean = false;
  timeInterval: any;
  timerPaused: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fireStore: AngularFirestore,private alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');


    this.loader = true;
    this.noOrders = false;

    this.fireStore.collection('deliveries').valueChanges().subscribe(values =>{
      this.checkOrders();
    });


  }

  deleteOrder(order){
    var orderSource = this.fireStore.doc<any>('deliveries/' + order.time);
    orderSource.update({alive:false});
  }

  approveOrder(order){
    var orderSource = this.fireStore.doc<any>('deliveries/' + order.time);
    orderSource.update({approved:true});
  }

  cancelOrder(order){
    var orderSource = this.fireStore.doc<any>('deliveries/' + order.time);
    orderSource.update({approved:false});

    console.log('Order Cancelled');
  }

  goHome(){
    this.navCtrl.push(HomePage);
  }

  setTimer(order){
      var orderSource = this.fireStore.doc<any>('deliveries/' + order.time);
      orderSource.update({timer:true});

      console.log('Order Timer Set')

      this.timeInterval = setInterval(() => {

        this.timeLeft--
        var time = this.toTimeString(this.timeLeft);
        this.timerTime = time;

      },1000)

  }

  pauseTimer(time){
    console.log('order timer paused at ' + time)

    if(this.timeInterval){
      clearInterval(this.timeInterval);
      this.timeInterval = null;
      this.timerTime = time;
    }else{
      console.log('No timer found')
    }

    this.timerPaused = true;
  }

  resumeTimer(order){
    this.timerPaused = false;
    this.setTimer(order)
  }

  completeOrder(order){
    var orderSource = this.fireStore.doc<any>('deliveries/' + order.time);
    orderSource.update({alive:false});

    console.log('Order Completed')

    this.checkOrders();
    this.timeLeft = 180;
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

    this.fireStore.collection('deliveries').valueChanges().subscribe(values =>{
      this.orderValues = values;

      let runagain = true;

      values.forEach(eachObj => {
        if(eachObj['alive'] == false){
          deadCount++
        }

        if(runagain && eachObj['timer']){
          this.setTimer(eachObj)
          runagain = false;
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
        //console.log(deadCount + " DEADCOUNT VS FINALARRAY " + delArray.length);

        if(deadCount == delArray.length){
          console.log('No New Orders')
          this.loader = false;
          this.noOrders = true;
        }else{
          this.loader = false;
          this.deliveries = delArray2;

          this.orders = this.orderValues;

          // console.log('Orders Discovered: ')
          // console.log(this.orders);
          this.noOrders = false;
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
      recommended: false
    })

    alert('item added')
  }

  toTimeString(seconds) {
    return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
  }

}
