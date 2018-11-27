import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';

import { AngularFirestore } from 'angularfire2/firestore';


import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  userAddress: string;
  userTime: string;
  arrivalTime: any;
  approved: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fireStore: AngularFirestore,private alertCtrl: AlertController) {
    this.userAddress = localStorage.getItem('address');
    this.userTime = localStorage.getItem('currentCart');

    var d1 = new Date();
    var newDateObj = new Date();
    newDateObj.setTime(d1.getTime() + (30 * 60 * 1000));
    let hours = newDateObj.getHours();
    let minutes = newDateObj.getMinutes();

    this.arrivalTime = hours + ':' + minutes;
    var H = +this.arrivalTime.substr(0, 2);
    var h = H % 12 || 12;
    var ampm = (H < 12 || H === 24) ? "AM" : "PM";
    this.arrivalTime = h + this.arrivalTime.substr(2, 3) + ampm;

    if(this.userTime){
      this.fireStore.doc('deliveries/' + this.userTime).valueChanges().subscribe(values =>{
        console.log(values);

        if(!values){
          console.log('NO ORDER');

          localStorage.setItem('currentCart', null);
          this.navCtrl.push(HomePage)

        }else if(!values['alive'] && !values['approved']){
          console.log('ORDER ENDED');

          let alert = this.alertCtrl.create({
            subTitle: 'Sorry, your order has been declined :(',
            buttons: [{
              text: 'Dismiss',
              handler: () => {
                localStorage.setItem('currentCart', null);
                this.navCtrl.push(HomePage)
              }
            }
          ]
          });
          alert.present();

        }else if(!values['alive'] && values['approved']){

          let alert = this.alertCtrl.create({
            subTitle: 'Your driver has tagged your order as complete. Please rate Munch on the App Store :)',
            buttons: [{
              text: 'Dismiss',
              handler: () => {
                localStorage.setItem('currentCart', null);
                this.navCtrl.push(HomePage)
              }
            }, {
              text: 'Rate on App Store',
              handler: () => {
                console.log('User Rate')
              }
            }
          ]
          });
          alert.present();

        }else if(!values['approved']){
          console.log('New Order')
          this.approved = false;
        }else if(values['approved']){
          console.log('Access Granted');
          this.approved = true;
        }else{
          console.log('Unknown!!')

          localStorage.setItem('currentCart', null);
          this.navCtrl.push(HomePage)
        }
      });
    }
  }

  ionViewDidLoad() {

  }

}
