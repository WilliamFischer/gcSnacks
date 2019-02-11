import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';

import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@IonicPage()
@Component({
  selector: 'page-past-orders',
  templateUrl: 'past-orders.html',
})
export class PastOrdersPage {
  myOrdersArray: any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl : ViewController,
    public navParams: NavParams,
    private fireStore: AngularFirestore,
    public afAuth: AngularFireAuth,) {
  }

  ionViewDidLoad() {
    this.myOrdersArray = [];

    this.fireStore.collection('deliveries').valueChanges().subscribe(
      values =>{
        values.forEach(eachObj => {
          if(eachObj['uid'] == this.afAuth.auth.currentUser.uid){
            this.myOrdersArray.push(eachObj);
          }
        });

        console.log(this.myOrdersArray)
      });
  }

  closeOrder(){
    this.viewCtrl.dismiss();
  }

}
