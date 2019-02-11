import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';


import { HomePage } from '../pages/home/home';
import { OrderPage } from '../pages/order/order';
import { LoginPage } from '../pages/login/login';

// Firebase
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private afAuth: AngularFireAuth, public fireStore: AngularFirestore) {
    platform.ready().then(() => {

      var currentCartTime = localStorage.getItem('currentCart');
      
      console.log('Current Time in cart:' + currentCartTime)

      //** AUTH LOGIN **//
      this.afAuth.authState.subscribe(auth=>{
         if(auth){
           if(!currentCartTime || currentCartTime == 'null'){
             console.log("User Has No Order")
             this.rootPage = HomePage;
           }else{
             this.fireStore.doc('deliveries/' + currentCartTime).snapshotChanges().subscribe(values =>{
                console.log('USER\'S CART');
                console.log(values);

                if(!values){
                  console.log("User Has No Order")
                  this.rootPage = HomePage;
                }else{
                  console.log("User Has Order")
                  this.rootPage = OrderPage;
                }
            });
           }
         }
         else{
            this.rootPage = LoginPage
         }
      })

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

    });
  }
}
