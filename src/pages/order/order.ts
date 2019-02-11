import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

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
  timer: boolean;
  timeLeft: number = 180;
  timerTime: string = '00:03:00';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fireStore: AngularFirestore,
    public afAuth: AngularFireAuth,
    private alertCtrl: AlertController) {

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
          let dontTriggerHome = localStorage.getItem('homeTrigger');

          if(!values && dontTriggerHome != '1'){
            console.log('NO ORDER');

            localStorage.setItem('currentCart', null);
            this.navCtrl.push(HomePage)

          }else if (!values && dontTriggerHome == '1'){
            console.log('ORDER CANCELLED BUT REMAINS');
            localStorage.removeItem('homeTrigger');
          }else if(!values['alive'] && !values['approved'] && dontTriggerHome != '1'){
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

          }else if(!values['alive'] && values['approved'] && dontTriggerHome != '1'){

            let alert = this.alertCtrl.create({
              subTitle: 'Your driver has tagged your order as complete. Please rate Munch on the App Store :)',
              buttons: [{
                text: 'Dismiss',
                handler: () => {
                  var userUID = this.afAuth.auth.currentUser.uid;

                  this.fireStore.collection('users/' + userUID + '/cart').valueChanges().subscribe(values =>{
                    values.forEach(value => {
                      var userCart = this.fireStore.doc<any>('users/' + userUID + '/cart/' + value['item']);;
                      userCart.delete();
                    });

                    localStorage.setItem('currentCart', null);
                    localStorage.setItem('homeTrigger', '1');
                    this.navCtrl.push(HomePage)
                  });
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

          }else if(!values['approved'] && dontTriggerHome != '1'){
            console.log('New Order')
            this.approved = false;
          }else if(values['approved'] && dontTriggerHome != '1'){
            console.log('Access Granted');
            this.approved = true;

            if(!values['timer']){
              this.timer = false;
            }else{
              this.timer = true;

              var timeInterval = setInterval(() => {

                this.timeLeft--
                var time = this.toTimeString(this.timeLeft);
                this.timerTime = time;

                if(this.timerTime == '00:00:00'){
                  clearInterval(timeInterval);

                  let alert = this.alertCtrl.create({
                    subTitle: 'You are out of time, your order has been cancelled',
                    buttons: [{
                      text: 'Dismiss',
                      handler: () => {
                        var cartSource = this.fireStore.doc<any>('deliveries/' + this.userTime);
                        cartSource.delete();

                        var userUID = this.afAuth.auth.currentUser.uid;

                        this.fireStore.collection('users/' + userUID + '/cart').valueChanges().subscribe(values =>{
                          values.forEach(value => {
                            var userCart = this.fireStore.doc<any>('users/' + userUID + '/cart/' + value['item']);;
                            userCart.delete();
                          });

                          localStorage.setItem('currentCart', null);
                          localStorage.setItem('homeTrigger', '1');

                          this.navCtrl.push(HomePage);
                        });
                      }
                    }
                  ]
                  });
                  alert.present();
                }else if(this.timerTime == '00:01:00'){
                  let alert = this.alertCtrl.create({
                    subTitle: 'You are nearly out of time, please go to your driver',
                    buttons: [{
                      text: 'Dismiss',
                      role: 'cancel',
                    }]
                  });
                  alert.present();
                }

              },1000)


            }

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

  toTimeString(seconds) {
    return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
  }

  cancelOrder(){

    let alert = this.alertCtrl.create({
      subTitle: 'Are you sure you want to cancel your order?',
      buttons: [{
        text: 'Dismiss',
        role: 'cancel',
      }, {
        text: 'CANCEL',
        handler: () => {
          console.log('ORDER DELETED!!')

          var cartSource = this.fireStore.doc<any>('deliveries/' + this.userTime);
          cartSource.delete();

          localStorage.setItem('currentCart', null);
          localStorage.setItem('homeTrigger', '1');

          this.navCtrl.pop();
        }
      }
    ]
    });
    alert.present();
  }

}
